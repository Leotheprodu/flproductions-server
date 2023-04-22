const { matchedData } = require('express-validator');
const { usuariosModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');

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
        const data = await usuariosModel.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        data.set('password', undefined, { strict: false });
        res.status(200).send({ data });

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