const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const Mensajes_generales = sequelize.define(
    'mensajes_generales',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        tipo_de_mensaje: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mensaje: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Mensajes_generales;
