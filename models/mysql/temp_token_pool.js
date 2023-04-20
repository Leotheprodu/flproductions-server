const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const Temp_token_pool = sequelize.define(
    'temp_token_pool',
    {
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            select:false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        }

    },
    {
        timestamps: false,
        tableName: 'temp_token_pool'
    });

module.exports = Temp_token_pool;