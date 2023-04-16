const { artistasModel } = require('../models');

const mysql = require("mysql2");
const credentials = require("../config/credentials")
const connection = mysql.createConnection(credentials);
/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItems = async (req, res) => {
    try {
        const artistas = await artistasModel.findAll();
        res.status(200).send({ artistas });

    }catch(error) {
        console.error(error);
        res.status(500).send('Error al cargar artistas')
    }
    /* connection.query('SELECT * FROM artistas', (error, result) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).json({ artistas: result });
        }
    }); */
}

/**
 * Obtener un detalle!
 * @param {*} req
 * @param {*} res

*/
const getItem = (req, res) => {

}

/**
 * Insertar un registro!
 * @param {*} req
 * @param {*} res

*/
const createItem = (req, res) => {

}

/**
 * Actualizar un registro!
 * @param {*} req
 * @param {*} res

*/
const updateItem = (req, res) => {

}

/**
 * Eliminar un registro!
 * @param {*} req
 * @param {*} res

*/
const deleteItem = (req, res) => {

}

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };