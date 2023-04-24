const { matchedData } = require('express-validator');
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