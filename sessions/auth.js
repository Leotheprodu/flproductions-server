const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const credentials = require("../database/dbconnections");
const connection = mysql.createConnection(credentials);
const bcrypt = require('bcrypt');
const saltRounds = 10;




// Manejamos la solicitud de inicio de sesión
router.post("/login", (req, res) => {
  const { email, password } = req.body;


  // Creamos una consulta preparada con marcadores de posición
  const query = "SELECT * FROM usuarios WHERE email = ?";
  const values = [email];

  // Ejecutamos la consulta preparada con los valores de los marcadores de posición
  connection.query(query, values, (error, results) => {
    if (error) {
      // Enviamos una respuesta de error si hay un error en la consulta
      res.status(500).json({ message: "Error en la consulta, el usuario no existe" });
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
          }

        });
      }

      rolesUsuario(results[0].id)

      // Comparamos el password hasheado almacenado en la base de datos con el password proporcionado en la solicitud de login
      bcrypt.compare(password, results[0].password, (error, isMatch) => {
        if (isMatch) {
          req.session.isLoggedIn = true;
          req.session.user_id = results[0].id;
          handlelogin();
        } else {
          // Enviamos una respuesta de error si las credenciales son inválidas
          res.status(401).json({ message: "el password no coincide con ningun registro" });
        }
      });
    } else {
      // Enviamos una respuesta de error si las credenciales son inválidas
      res.status(401).json({ message: "Credenciales inválidas, verifica y vuelve a intentar" });
    }

    function handlelogin() {
      if (process.env.NODE_ENV === 'production') {
        res.cookie("sessionId", req.session.id, { httpOnly: true, secure: true, maxAge: 3600000 }); // Establecemos la cookie de sesión

      } else {
        res.cookie("sessionId", req.session.id, { httpOnly: true, secure: false, maxAge: 3600000 });
      }
      res.status(200).json({ message: "Inicio de sesión exitoso!", isLoggedIn: true, userId: req.session.user_id, roles: req.session.roles });

    }
  });
});


router.post("/logout", (req, res) => {

  req.session.isLoggedIn = false;
  res.status(200).json({ message: "Cierre de sesión exitoso!" });
});

router.get("/check-session", (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).json({ isLoggedIn: true, userId: req.session.user_id, roles: req.session.roles });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});




router.post("/signup", (req, res) => {
  const { email, password, username, fecha_creacion } = req.body;

  const query = "SELECT * FROM usuarios WHERE email = ?";
  const values = [email];

  connection.query(query, values, (error, results) => {
    if (error) {
      // Enviamos una respuesta de error si hay un error en la consulta
      res.status(500).json({ message: "Ha ocurrido un error al verificar el correo" });
    } else if (results.length >= 1) {
      res.status(403).json({ message: "Correo ya existe" });
      return;
    }else{
      // Hashea el password utilizando bcrypt
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Ha ocurrido un error con el password" });
      return;
    }

    // Crea un objeto con los datos del nuevo usuario y el password hasheado
    const newUser = {
      username: username,
      password: hash,
      email: email,
      fecha_creacion: fecha_creacion
    };

    // Inserta el nuevo usuario en la tabla de usuarios

    connection.query('INSERT INTO usuarios SET ?', newUser, function (error, results, fields) {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Ha ocurrido un error al guardar los el registro" });
        return;
      }

      res.status(200).json({ message: "Usuario creado con éxito" });

    });
  });
    }


  });

  
});
module.exports = router;