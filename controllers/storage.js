const { storageModel } = require('../models');
const PUBLIC_URL = (process.env.NODE_ENV === 'production') ? process.env.PUBLIC_URL_PROD : process.env.PUBLIC_URL_DEV 
/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItems = (req, res) => {

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
const createItem = async (req, res) => {

    try {
        const { file } = req

        const fileData = {
            filename: file.filename,
            url:`${PUBLIC_URL}/${file.filename}`

        }

        const data = await storageModel.create(fileData);

        res.status(200).send({ data });

    }catch(error) {
        console.error(error);
        res.status(500).send({message: 'Error al guardar registro', error})
    }
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