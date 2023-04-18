const { artistasModel } = require('../models');

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
        res.status(500).send({message: 'Error al cargar los artistas', error})
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
const createItem = async (req, res) => {
    const { body } = req
    try {
        const artista = await artistasModel.create(body);
        res.status(200).send({ artista });

    }catch(error) {
        console.error(error);
        res.status(500).send({message: 'Error al crear el artista', error})
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