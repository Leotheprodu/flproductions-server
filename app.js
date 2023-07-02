/* DEPENDENCIAS */
require('dotenv').config({ override: true });
const express = require('express');
const PUERTO = process.env.PORT || 5000;
const cors = require('cors');
const morganBody = require('morgan-body');
const { loggerstream, log } = require('./config/logger');
const { dbConnectMySql } = require('./config/mysql');
const session = require('express-session');
const sess = require('./config/expressSessions');
const app = express();

morganBody(app, {
    noColors: true,
    stream: log,
    logRequestBody: false,
});

morganBody(app, {
    noColors: true,
    stream: loggerstream,
    skip: function (req, res) {
        return res.statusCode < 400;
    },
});

app.use(
    cors({
        origin: process.env.LINK_CORS,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Origin',
            'X-Requested-With',
            'Accept',
            'x-client-key',
            'x-client-token',
            'x-client-secret',
            'Authorization',
        ],
        credentials: true,
    })
);
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.static('storage'));
app.use(session(sess));
app.use('/api', require('./routes'));

/**
 * Manejo de Errores personalizados
 */
app.use(function (err, req, res, next) {
    if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: 'Tipo de archivo no permitido' });
    }

    next(err);
});
app.use(function (err, req, res, next) {
    if (err.code === 'FILE_SIZE_LIMIT_EXCEEDED') {
        return res
            .status(400)
            .json({ error: 'Tamaño de archivo excede el limite' });
    }

    next(err);
});
/* app.use((err, req, res) => {
    console.error(err);
    res.status(500).send({ message: 'Ocurrió un error en el servidor' });
});
 */
const server = app.listen(PUERTO, () => {
    console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
});

server.timeout = 30000;

dbConnectMySql();
