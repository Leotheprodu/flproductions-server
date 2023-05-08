const session = require('express-session');
const mysql = require('mysql2/promise');
const credentials = require('./credentials');
const connection = mysql.createPool(credentials);
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({}, connection);

const sess = {
    key: 'sessionId',
    secret: process.env.SECRET_EXPRESS_SESSION,
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        secure: process.env.NODE_ENV === 'production' ? true : false,
    }, // Configuramos una cookie segura y establecemos una expiración de 1 hora
};

module.exports = sess;
