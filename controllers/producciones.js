const { produccionesModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');

/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItems = async (req, res) => {
    try {
        const producciones = await produccionesModel.findAllData();
        res.status(200).send({ producciones });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al cargar las producciones');
    }
};

/**
 * Obtener un detalle!
 * @param {*} req
 * @param {*} res

*/
const getItem = async () => {};

/**
 * Insertar un registro!
 * @param {*} req
 * @param {*} res

*/
const createItem = async () => {};

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
const deleteItem = async () => {};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
