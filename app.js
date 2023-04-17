/* DEPENDENCIAS */
require('dotenv').config({ override: true })
const path = require("path");
const express = require("express");
const cors = require("cors");
const credentials = require("./config/credentials");
const session = require('express-session');
const mysql2 = require("mysql2/promise");
const connection2 = mysql2.createPool(credentials);
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({}/* session store options */, connection2);
const { dbConnectMySql } = require('./config/mysql');
const ENGINE_DB = process.env.ENGINE_DB;

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
  origin: process.env.LINK_DEV_HOST, // use your actual domain name (or localhost), using * is not recommended
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}))

app.use(express.json());
app.use(express.static('storage'));
app.use(session(sess));


app.use((err, req, res, next) => {
  res.status(500).send('Ocurrió un error en el servidor');
});


if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use('/api', require('./routes'));

const server = app.listen(PUERTO, () => {
console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);

});

server.timeout = 30000;

/* (ENGINE_DB === 'sql') ? dbConnectMySql() : dbConnectNoSql(); */
dbConnectMySql();