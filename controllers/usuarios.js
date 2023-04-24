const { matchedData } = require('express-validator');
const { usuariosModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');
const { refreshUserRoles } = require('../utils/handleRoles');

/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItems = async (req, res) => {

    try {
        const data = await usuariosModel.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).send({ data });

    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al cargar los usuarios');
    };
};

/**
 * Obtener un detalle!
 * @param {*} req
 * @param {*} res

*/
const getItem = async (req, res) => {
    try {

        const { id } = matchedData(req);
        if (parseInt(id) === req.session.user.id || (req.session.roles).includes(5)) {

            const data = await usuariosModel.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
            req.session.user = data
            req.session.roles = await refreshUserRoles(data.id);
            res.status(200).send({ message: "Datos de usuario generados con exito", isLoggedIn: true, user: req.session.user, roles: req.session.roles });
        }else{
            handleHttpError(res, 'No tiene Permiso para ver esta informacion',401);
        }

    } catch (error) {
        handleHttpError(res, 'Error al cargar el usuario');
    }
}

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
const updateItem = async (req, res) => {

}

/**
 * Eliminar un registro!
 * @param {*} req
 * @param {*} res

*/
const deleteItem = async (req, res) => {

}

module.exports = { getItems, getItem, updateItem, deleteItem };