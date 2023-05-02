const { matchedData } = require('express-validator');
const { usuariosModel, avatar_usersModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');
const { refreshUserRoles } = require('../utils/handleRoles');

/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItems = async (req, res) => {
    try {
        const data = await usuariosModel.scope('activos').findAll({
            attributes: { exclude: ['password'] },
        });
        res.status(200).send({ data });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al cargar los usuarios');
    }
};

/**
 * Obtener un detalle!
 * @param {*} req
 * @param {*} res

*/
const getItem = async (req, res) => {
    try {
        const { id } = matchedData(req);
        if (
            parseInt(id) === req.session.user.id ||
            req.session.roles.includes(5)
        ) {
            const data = await usuariosModel.findByPk(id, {
                attributes: { exclude: ['password'] },
            });
            req.session.user = data;
            req.session.roles = await refreshUserRoles(data.id);
            res.status(200).send({
                message: 'Datos de usuario generados con exito',
                isLoggedIn: true,
                user: req.session.user,
                roles: req.session.roles,
            });
        } else {
            handleHttpError(
                res,
                'No tiene Permiso para ver esta informacion',
                401
            );
        }
    } catch (error) {
        handleHttpError(res, 'Error al cargar el usuario');
    }
};

/**
 * Insertar un registro!
 * @param {*} req
 * @param {*} res

*/

/**
 * Actualizar un registro!
 * @param {*} req
 * @param {*} res

*/
const updateItem = async () => {};

/**
 * Eliminar un registro!
 * @param {*} req
 * @param {*} res

*/
const deleteItem = async (req, res) => {
    try {
        const { id } = matchedData(req);
        if (
            parseInt(id) === req.session.user.id ||
            req.session.roles.includes(5)
        ) {
            const user = await usuariosModel.findByPk(id);
            if (!user) {
                handleHttpError(res, 'No se encontro el usuario', 404);
            }

            user.activo = 0;
            await user.save();
            res.status(200).send({ message: 'Usuario Eliminado' });
        } else {
            handleHttpError(
                res,
                'No tiene Permiso para ver esta informacion',
                401
            );
        }
    } catch (error) {
        handleHttpError(res, 'Error al intentar eliminar usuario');
    }
};
/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const avatarCtrl = async (req, res) => {
    try {
        const { id } = matchedData(req);
        const data = await avatar_usersModel.findOne({
            where: { user_id: id },
        });

        res.status(200).json({
            message: 'avatar encontrado',
            avatar: data.avatar,
        });
    } catch (error) {
        res.status(200).json({
            message: 'avatar no Encontrado',
            avatar: 8,
        });
    }
};
const avatarUpdateCtrl = async (req, res) => {
    try {
        const { id, avatar } = matchedData(req);

        if (parseInt(id) !== req.session.user.id)
            return handleHttpError(res, 'NOT_PERMISSION', 401);

        const userAvatar = await avatar_usersModel.findOne({
            where: { user_id: id },
        });
        await userAvatar.update({ avatar });
        req.session.avatar = avatar;
        res.status(200).json({
            message: 'avatar actualizado',
            avatar: userAvatar.avatar,
        });
    } catch (error) {
        handleHttpError(res, 'Error al intentar actualizar avatar de usuario');
    }
};

module.exports = {
    getItems,
    getItem,
    updateItem,
    deleteItem,
    avatarCtrl,
    avatarUpdateCtrl,
};
