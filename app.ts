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
import { Response, Request } from 'express';

morganBody(app, {
    noColors: true,
    stream: log,
    logRequestBody: false,
});

morganBody(app, {
    noColors: true,
    stream: loggerstream,
    skip: function (res: Response) {
        return res.statusCode < 400;
    },
});

app.use(
    cors({
        origin: process.env.LINK_DEV_HOST,
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
app.use(express.json());
app.use(express.static('storage'));
app.use(session(sess));
app.use('/api', require('./routes'));

app.use((res: Response) => {
    res.status(500).send('Ocurrió un error en el servidor');
});

const server = app.listen(PUERTO, () => {
    console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
});

server.timeout = 30000;

dbConnectMySql();
//vamos a ver si eso compila
