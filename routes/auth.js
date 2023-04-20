const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const credentials = require("../config/credentials");
const connection = mysql.createConnection(credentials);
const bcrypt = require('bcrypt');
const rateLimit = require("../config/rate-limit");

router.use("/login", rateLimit);

router.post("/login", (req, res) => {


  const { email, password } = req.body;

  // Creamos una consulta preparada con marcadores de posición
  const query = "SELECT * FROM usuarios WHERE email = ?";
  const values = [email];

  /* if (req.session.blockedUntil && req.session.blockedUntil > Date.now()) {
    
    return;
  } */
  // Ejecutamos la consulta preparada con los valores de los marcadores de posición
  connection.query(query, values, (error, results) => {
    if (error) {
      // Enviamos una respuesta de error si hay un error en la consulta
      res.status(500).json({ message: "Error en la consulta login" });
    } else if (results.length === 1) {
      //buscamos los roles del usuario y lo almacenamos en la sesion
      const rolesUsuario = (id) => {
        const query = "SELECT role_id FROM role_users WHERE user_id = ?";
        const values = [id];
        connection.query(query, values, (error, results) => {

          if (error) {
            console.log(error)

          } else {
            req.session.roles = results.map(obj => obj.role_id).filter(val => val !== undefined);
            handlelogin();
          }

        });
      }

      // Comparamos el password hasheado almacenado en la base de datos con el password proporcionado en la solicitud de login
      bcrypt.compare(password, results[0].password, (error, isMatch) => {
        if (error) {
          res.status(500).json({ message: "Error en la consulta de match de password" });
          return;
        } else if (isMatch) {
          req.session.isLoggedIn = true;
          req.session.user = results[0];
          rolesUsuario(results[0].id);
          

        } else {
          // Enviamos una respuesta de error si las credenciales son inválidas
          res.status(401).json({ message: "password incorrecto" });
          req.session.loginAttempts = (req.session.loginAttempts || 0) + 1;
          if (req.session.loginAttempts >= 5) {
            req.session.blockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutos
          }
          return;
        }
      });

    } else {

      // Enviamos una respuesta de error si las credenciales son inválidas
      return res.status(401).json({ message: "El correo no existe" });
    }

    function handlelogin() {
      if (process.env.NODE_ENV === 'production') {
        res.cookie("sessionId", req.session.id, { httpOnly: true, secure: true, maxAge: 3600000 }); // Establecemos la cookie de sesión

      } else {
        res.cookie("sessionId", req.session.id, { httpOnly: true, secure: false, maxAge: 3600000 });
      }
      req.session.loginAttempts = 0;
      res.status(200).json({ message: "Inicio de sesión exitoso!", isLoggedIn: true, user: req.session.user, roles: req.session.roles });

    }
  });
}); // seguridad: solo si coincide el correo y password puede proceder con la logica ademas por ip solo puede intentar autenticar 5 veces o se bloquea por 15 min

router.get("/logout", (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.isLoggedIn = false;
    res.status(200).json({ message: "Cierre de sesión exitoso!", isLoggedIn: false, user: req.session.user, roles: req.session.roles });

  } else {
    res.status(401).json({ message: "Solo puedes cerrar sesion si has iniciado sesion" });
  }
}); // seguridad: solo si ha iniciado sesion puede hacer logout

router.get("/check-session", (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).send({ message: "El usuario ha iniciado sesion", isLoggedIn: true, user: req.session.user, roles: req.session.roles });
  } else {
    res.status(200).send({ message: "El usuario no ha iniciado sesion", isLoggedIn: false, user: {}, roles: [] });
  }
}); // seguridad: este endpoint por si misma es segura



module.exports = router;