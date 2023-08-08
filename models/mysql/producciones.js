const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');
const { Op } = require('sequelize');
const Artistas = require('./artistas');

const Producciones = sequelize.define(
    'producciones',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        id_artista: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        spotify_link: {
            type: DataTypes.STRING,
        },
        youtube_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        destacado: {
            type: DataTypes.TINYINT,
            allowNull: false,
        },
        tipo_obra: {
            type: DataTypes.TINYINT,
            allowNull: false,
        },
        estilo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        genero: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bpm: {
            type: DataTypes.INTEGER,
        },
        key: {
            type: DataTypes.STRING,
        },
        fecha_lanzamiento: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
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
Producciones.findAllData = async function (page, pageSize, types) {
    Producciones.belongsTo(Artistas, {
        foreignKey: 'id_artista',
    });
    const typeList = !types
        ? null
        : types.includes(',')
        ? types.split(',').map((type) => parseInt(type))
        : [parseInt(types)];
    const whereClause = types ? { tipo_obra: { [Op.in]: typeList } } : {};
    const offset = (page - 1) * pageSize;
    return Producciones.findAll({
        include: Artistas,
        order: [['fecha_lanzamiento', 'DESC']],
        offset,
        limit: pageSize,
        where: whereClause,
    });
};

module.exports = Producciones;
