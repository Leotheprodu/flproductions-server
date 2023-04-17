const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const Storage = sequelize.define(
    'storage',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },

        url: {
            type: DataTypes.STRING,
        },
        filename: {
            type: DataTypes.STRING,
        }

    },
    {
        timestamps: false,
    });

module.exports = Storage;