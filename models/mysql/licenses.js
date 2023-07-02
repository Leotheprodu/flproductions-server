const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const Licenses = sequelize.define(
    'licenses',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Licenses;
