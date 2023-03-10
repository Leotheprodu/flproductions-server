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
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
          
        } else{
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
        res.status(401).json({ message: "Credenciales inválidas, verifica y vuelve a intentar" });
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


app.post("/api/logout", (req, res) => {

  req.session.isLoggedIn = false;
  res.status(200).json({ message: "Cierre de sesión exitoso!" });
});

app.get("/api/check-session", (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).json({ isLoggedIn: true, userId: req.session.user_id, roles: req.session.roles });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});

app.get('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id === req.session.user_id && req.session.isLoggedIn) {
    const query = `SELECT * FROM usuarios WHERE id = ?`;
    const values = [id];
    connection.query(query, values, (error, results, fields) => {
      if (error) {
        console.error(error);
      } else {
        res.status(200).json({ user_data: results[0] });

      }
    });
  } else {
    res.status(401).json({ message: "No tienes permiso para acceder a este recurso." });
  }

});


app.post("/api/signup", (req, res) => {
  const { email, password, username,fecha_creacion, role_id } = req.body;

  // Hashea el password utilizando bcrypt
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Ha ocurrido un error al crear el usuario" });
      return;
    }

    // Crea un objeto con los datos del nuevo usuario y el password hasheado
    const newUser = {
      username: username,
      password: hash,
      email: email,
      fecha_creacion: fecha_creacion,
      role_id: role_id
    };

    // Inserta el nuevo usuario en la tabla de usuarios
    connection.query('INSERT INTO usuarios SET ?', newUser, function (error, results, fields) {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Ha ocurrido un error al crear el usuario" });
        return;
      }

      res.status(200).json({ message: "Nuevo usuario creado con éxito" });
      console.log('Nuevo usuario creado con éxito');
    });
  });
});
module.exports = app;