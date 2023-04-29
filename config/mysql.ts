const { Sequelize } = require('sequelize');

const database = process.env.DB_DB;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = 'localhost';

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: 'mysql',
});

const dbConnectMySql = async () => {
    try {
        await sequelize.authenticate();
        console.log('MYSQL Conexion Correcta');
    } catch (e) {
        console.log('MYSQL Error de Conexion', e);
    }
};

module.exports = { sequelize, dbConnectMySql };

/* 

*****esto es para la conexion mysql******

const mysql = require("mysql2");
const credentials = require("./credentials")
const connection = mysql.createConnection(credentials);


const dbConnect = () => {

    mysql.createConnection(credentials);

}

module.exports = dbConnect; */
