const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const Avatar_users = sequelize.define(
    'avatar_users',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        avatar: {
            type: DataTypes.INTEGER,
            allowNull: false,
            select: false,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Avatar_users;
