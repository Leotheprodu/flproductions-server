const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');
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

    },
    {
        timestamps: false,
    });

    /**
     * Implementando Modelo Personalizado
     */
    Producciones.findAllData = function(){
        Producciones.belongsTo(Artistas, {
            foreignKey:'id_artista',
        });
        return Producciones.findAll({include:Artistas});
    };


module.exports = Producciones;