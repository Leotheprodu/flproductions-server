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
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            select:false,
        },
        fecha_creacion: {
            type: DataTypes.DATE,

        },ultima_actualizacion: {
            type: DataTypes.TIME,
        }

    },
    {
        timestamps: false,
        defaultScope: {
            attributes: { exclude: ['password'] }
        }
    });

    Usuarios.addScope('withPassword', {
        attributes: { include: ['password'] } // Incluye el campo `password` en este scope
    });
module.exports = Usuarios;