const { matchedData } = require('express-validator');
const { artistasModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');

/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItems = async (req, res) => {
    try {
        const artistas = await artistasModel.findAll();
        res.status(200).send({ artistas });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al cargar los artistas');
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
        const artista = await artistasModel.findByPk(id);
        res.status(200).send({ artista });
    } catch (error) {
        handleHttpError(res, 'Error al cargar el artista');
    }
};

/**
 * Insertar un registro!
 * @param {*} req
 * @param {*} res

*/
const createItem = async (req, res) => {
    try {
        const body = matchedData(req);
        const artista = await artistasModel.create(body);
        res.status(200).send({ artista });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al crear el artista');
    }
};

/**
 * Actualizar un registro!
 * @param {*} req
 * @param {*} res

*/
const updateItem = async (req, res) => {
    try {
        const { id, ...body } = matchedData(req);
        const artista = await artistasModel.findByPk(id); // buscar la instancia por su identificador
        if (!artista) return handleHttpError(res, 'Artista no encontrado', 404);

        if (req.session.user.id !== artista.user_id) {
            if (!req.session.roles.includes(5))
                return handleHttpError(res, 'NOT_PERMISSION', 401);
        }

        await artista.update(body); // actualizar la instancia
        res.status(200).send({ message: 'actualizado con exito' });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al actualizar el artista');
    }
};

/**
 * Eliminar un registro!
 * @param {*} req
 * @param {*} res

*/
const deleteItem = async (req, res) => {
    try {
        const { id } = matchedData(req);
        const artista = await artistasModel.findByPk(id);
        if (!artista) {
            return handleHttpError(res, 'Artista no encontrado', 404);
        }

        await artista.destroy();
        res.status(200).send({ message: 'Artista eliminado correctamente' });
    } catch (error) {
        handleHttpError(res, 'Error al cargar el artista');
    }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
