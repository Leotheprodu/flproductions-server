const { Sequelize } = require('sequelize');
const { port, host, user, password, database } = require('./credentials');

const sequelize = new Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    port: port,
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
