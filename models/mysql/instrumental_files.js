const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');
/* const producciones = require('./producciones'); */

const Instrumental_files = sequelize.define(
    'instrumental_files',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        producciones_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        file_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
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
/* Producciones.findAllData = function () {
    Producciones.belongsTo(Artistas, {
        foreignKey: 'id_artista',
    });
    return Producciones.findAll({ include: Artistas, order: [['id', 'DESC']] });
}; */

module.exports = Instrumental_files;
