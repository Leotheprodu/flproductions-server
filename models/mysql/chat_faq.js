const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const Chat_faq = sequelize.define(
    'chat_faq',
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
        },
        other_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pregunta: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        respuesta: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: 'chat_faq',
    }
);

module.exports = Chat_faq;
