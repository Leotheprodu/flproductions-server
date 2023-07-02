const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');
/* const producciones = require('./producciones'); */

const Instrumental_licenses = sequelize.define(
    'instrumental_licenses',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_inst_file: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_license: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        producciones_id: {
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

module.exports = Instrumental_licenses;
