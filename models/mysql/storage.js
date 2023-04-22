const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const Storage = sequelize.define(
    'storage',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        originalname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ext: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
        }

    },
    {
        tableName: 'storage',
    });

module.exports = Storage;