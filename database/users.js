const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const mysql2 = require("mysql2/promise");
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
app.use(cors({
  origin: "http://localhost:5173", // use your actual domain name (or localhost), using * is not recommended
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}))

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));
app.use(express.json());

// Manejamos la solicitud de inicio de sesión
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Creamos una consulta preparada con marcadores de posición
  const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
  const values = [email, password];

  // Ejecutamos la consulta preparada con los valores de los marcadores de posición
  connection.query(query, values, (error, results) => {
    if (error) {
      // Enviamos una respuesta de error si hay un error en la consulta
      res.status(500).json({ message: "Error en la consulta, el usuario no existe" });
    } else if (results.length === 1 && req.session.user_id === results[0].id) {
      
      req.session.isLoggedIn = true;
      req.session.user_id = results[0].id;
      req.session.role = results[0].role_id;
      handlelogin(results);
    }else if(results.length === 1 && req.session.user_id !== results[0].id) { 
      /* res.clearCookie("sessionId", { httpOnly: true, secure: true });
      req.session.regenerate(); */
      req.session.isLoggedIn = true;
      req.session.user_id = results[0].id;
      req.session.role = results[0].role_id;

      handlelogin(results);



    } else {
      // Enviamos una respuesta de error si las credenciales son inválidas
      res.status(401).json({ message: "Credenciales inválidas." });
    }

    function handlelogin(results) {
      if (process.env.NODE_ENV === 'production') {
        res.cookie("sessionId", req.session.id, { httpOnly: true, secure: true, maxAge: 3600000 }); // Establecemos la cookie de sesión

      } else {
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
          res.status(200).json({ message: "Inicio de sesión exitoso!", isLoggedIn: true, userId: req.session.user_id, role: req.session.role });


        }

      });
    }
  });
});


app.post("/api/logout", (req, res) => {

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
  res.status(200).json({ message: "Cierre de sesión exitoso!" });
});

app.get("/api/check-session", (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).json({ isLoggedIn: true, userId: req.session.user_id, role: req.session.role });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});

app.get('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if(id === req.session.user_id && req.session.isLoggedIn) {
    const query = `SELECT * FROM usuarios WHERE id = ?`;
    const values = [id];
    connection.query(query, values,(error, results, fields) => {
      if (error) throw error;
      res.status(200).json(results[0]);
    });
  }else{
    res.status(401).json({ message: "No tienes permiso para acceder a este recurso." });
  }

});


module.exports = app;