/* const { matchedData } = require('express-validator'); */
const { usuariosModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');


/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItems = async (req, res) => {
    try {
        const users = await usuariosModel.findAll();
        res.status(200).send({ usuarios: users });

    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al cargar los usuarios');
    }
}

/**
 * Obtener un detalle!
 * @param {*} req
 * @param {*} res

*/
const getItem = async (req, res) => {

}

/**
 * Insertar un registro!
 * @param {*} req
 * @param {*} res

*/
const createItem = async (req, res) => {

}

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

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };