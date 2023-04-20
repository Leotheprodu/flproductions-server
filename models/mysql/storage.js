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
        },
        filename: {
            type: DataTypes.STRING,
        },
        originalname: {
            type: DataTypes.STRING,
        }

    },
    {
        tableName: 'storage',
    });

module.exports = Storage;