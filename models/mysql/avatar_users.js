const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');
const Usuarios = require('./usuarios');

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
Avatar_users.findOneData = function (id) {
    Avatar_users.belongsTo(Usuarios, { foreignKey: 'user_id' });
    return Avatar_users.findOne({
        where: { user_id: id },
        include: [{ model: Usuarios, attributes: ['username'] }],
        raw: true,
    });
};
module.exports = Avatar_users;
