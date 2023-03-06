const express = require("express");
const login = express();
const mysql = require("mysql2");
const mysql2 = require("mysql2/promise");
const cors = require("cors");
const session = require('express-session');
const credentials = require("./dbconnections");
const MySQLStore = require('express-mysql-session')(session);
const connection = mysql.createConnection(credentials);
const connection2 = mysql2.createPool(credentials);
const sessionStore = new MySQLStore({}/* session store options */, connection2);
const sess = {
  key: 'sessionId',
  secret: "music oso",
  store: sessionStore,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // Configuramos una cookie segura y establecemos una expiración de 1 hora
}

/* login.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    // Si el usuario ha iniciado sesión, no regeneramos la sesión
    return next();
  }

  // Si el usuario no ha iniciado sesión, regeneramos la sesión
  req.session.regenerate((err) => {
    if (err) console.error('Error al regenerar la sesión:', err);

    return next();
  });
}); */



if (login.get('env') === 'production') {
  login.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

login.use(session(sess));

login.use(cors({ credential: true, origin: "http://localhost:5173" }));
login.use(express.json());

// Manejamos la solicitud de inicio de sesión
login.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Creamos una consulta preparada con marcadores de posición
  const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
  const values = [email, password];

  // Ejecutamos la consulta preparada con los valores de los marcadores de posición
  connection.query(query, values, (error, results) => {
    if (error) {
      // Enviamos una respuesta de error si hay un error en la consulta
      res.status(500).json({ message: "Error en la consulta." });
    } else if (results.length === 1) {

      req.session.isLoggedIn = true;
      req.session.user_id = results[0].id;
      req.session.role = results[0].role_id;
      

      if (process.env.NODE_ENV === 'production'){
        res.cookie("sessionId", req.session.id, { httpOnly: true, secure: true, maxAge: 3600000 }); // Establecemos la cookie de sesión

      }else{
        res.cookie("sessionId", req.session.id, { httpOnly: true, secure: false, maxAge: 3600000 }); 
      }

      //actualiza los valores de la tabla de usuarios
      const valor = req.session.id;
      const id = results[0].id;
      connection.query(
        'UPDATE usuarios SET session_id = ? WHERE id = ?',
        [valor, id],
        (error, results) => {
          if (error) {
            console.error(error);
          }
        }
      );

      //he vuelto a generar la cosulta para actualizar la tabla de usuario con el nuevo session_id
      connection.query(query, values, (error, results) => {
        if (error) {
          // Enviamos una respuesta de error si hay un error en la consulta
          res.status(500).json({ message: "Error en la consulta." });
        } else {
          // Enviamos una respuesta exitosa si las credenciales son válidas
          res.status(200).json({ message: "Inicio de sesión exitoso!" });
          

        }

      });



    } else {
      // Enviamos una respuesta de error si las credenciales son inválidas
      res.status(401).json({ message: "Credenciales inválidas." });
    }
  });
});


login.post("/api/logout", (req, res) => {

  // primero eliminamos el session_id de la tabla de usuarios, luego, Destruimos la sesión del usuario y eliminamos la cookie de sesión
  const sessId = req.session.id
  connection.query(
    'UPDATE usuarios SET session_id = ? WHERE session_id = ?',
    [null, sessId],
    (error, results) => {
      if (error) {
        console.error(error);
      }
    }
  );
  req.session.isLoggedIn = false;
  /* res.clearCookie("sessionId", { httpOnly: true, secure: true }); */
  res.status(200).json({ message: "Cierre de sesión exitoso!" });
});

login.get("/api/check-session", (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).json({ isLoggedIn: true, userId: req.session.user_id, role: req.session.role });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});

/* login.get("/", (req, res) => {
  
}); */


module.exports = login;