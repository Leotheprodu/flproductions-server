const { matchedData } = require('express-validator');
const { usuariosModel, avatar_usersModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');
const { addUserRoles } = require('../utils/handleRoles');
const { resOkData } = require('../utils/handleOkResponses');

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

            resOkData(res, data);
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
        const data = await avatar_usersModel.findOneData(id);

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return handleHttpError(res, 'Avatar no encontrado', 401);
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
        if (!userAvatar) {
            await avatar_usersModel.create({ user_id: id, avatar });
        } else {
            await userAvatar.update({ avatar });
        }
        res.status(200).json({
            message: 'avatar actualizado',
            avatar: userAvatar.avatar,
        });
    } catch (error) {
        handleHttpError(res, 'Error al intentar actualizar avatar de usuario');
    }
};

const UserTypeCtrl = async (req, res) => {
    try {
        const { id, roles } = matchedData(req);
        if (parseInt(id) !== req.session.user.id)
            return handleHttpError(res, 'NOT_PERMISSION', 401);

        const rolesActualizados = await addUserRoles(id, roles, [3, 4]);
        res.status(200).json({
            message: 'Roles actualizados',
            roles: rolesActualizados,
        });
    } catch (error) {
        handleHttpError(res, 'ERROR_USER_TYPE');
    }
};

module.exports = {
    getItems,
    getItem,
    updateItem,
    deleteItem,
    avatarCtrl,
    avatarUpdateCtrl,
    UserTypeCtrl,
};
