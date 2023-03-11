/* DEPENDENCIAS */
const path = require("path");
const express = require("express");
const cors = require("cors");

const credentials = require("./database/dbconnections");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql2 = require("mysql2/promise");
const connection2 = mysql2.createPool(credentials);
const sessionStore = new MySQLStore({}/* session store options */, connection2);

const authRouter = require("./sessions/auth");
const userRouter = require("./users/user");
const artistasRouter = require("./music_app/artistas");

const PUERTO = process.env.PORT || 5000;
const app = express();
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

app.use(express.json());

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', artistasRouter);

app.use(express.static(path.resolve(__dirname, '../app/dist')));

// Manejar las peticiones GET en la ruta /api
app.get("/api", (req, res) => {
  res.redirect("/");
  
});

// Todas las peticiones GET que no hayamos manejado retornaran nuestro app React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../app/dist', 'index.html'));
});



app.listen(PUERTO, () => {
console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);

});