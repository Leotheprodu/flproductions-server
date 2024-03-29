const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const Artistas = sequelize.define(
    'artistas',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },

        nombre_artista: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instagram: {
            type: DataTypes.STRING,
        },
        spotify: {
            type: DataTypes.STRING,
        },
        imagen: {
            type: DataTypes.STRING,
        },
        info: {
            type: DataTypes.STRING,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

/**
 * Implementando Modelo Personalizado
 */

module.exports = Artistas;
