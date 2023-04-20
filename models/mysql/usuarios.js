const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const Usuarios = sequelize.define(
    'usuarios',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        fecha_creacion: {
            type: DataTypes.DATE,
        }

    },
    {
        timestamps: false,
    });

module.exports = Usuarios;