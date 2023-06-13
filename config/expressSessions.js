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
        maxAge: 86400000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : false,
    },
};

module.exports = sess;
