/* DEPENDENCIAS */
require('dotenv').config({ override: true })
const express = require("express");
const cors = require("cors");
const { dbConnectMySql } = require('./config/mysql');
const PUERTO = process.env.PORT || 5000;
const session = require('express-session');
const sess = require('./config/expressSessions');
const app = express();


app.use(cors({
  origin: process.env.LINK_DEV_HOST,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}))

app.use(express.json());
app.use(express.static('storage'));
app.use(session(sess));
app.use('/api', require('./routes'));

app.use((err, req, res, next) => {
  res.status(500).send('Ocurrió un error en el servidor');
});


/* if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
} */

const server = app.listen(PUERTO, () => {
console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);

});

server.timeout = 30000;

dbConnectMySql();