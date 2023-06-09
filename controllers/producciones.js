const { produccionesModel } = require('../models');
const { matchedData } = require('express-validator');
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
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItemsByArtist = async (req, res) => {
    try {
        const { id_artista } = matchedData(req);
        const producciones = await produccionesModel.findAll({
            where: { id_artista },
        });
        res.status(200).send(producciones);
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al cargar las producciones');
    }
};
const deleteSongCtrl = async (req, res) => {
    try {
        const songInfo = matchedData(req);
        const song = await produccionesModel.findOne({
            where: { id: songInfo.id },
        });
        if (song.id_artista === req.session.artista.id) {
            song.destroy();
            res.status(200).send({ message: 'Cancion eliminada con exito' });
        }
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al intentar eliminar cancion');
    }
};
const saveSongData = async (req, res) => {
    try {
        const songData = matchedData(req);

        try {
            await produccionesModel.update(songData, {
                where: { id: songData.id, id_artista: req.session.artista.id },
            });
            res.status(200).send({
                message: `cancion con id ${songData.id} actualizada con exito`,
            });
        } catch (error) {
            console.error(error);

            await produccionesModel.create({
                ...songData,
                id_artista: req.session.artista.id,
                destacado: 0,
                tipo_obra: req.session.artista.tipo === 1 ? 0 : 1,
            });
            res.status(200).send({ message: `cancion creada con exito` });
        }
    } catch (error) {
        console.error(error);
        handleHttpError(
            res,
            'Error al intentar agregar o actualizar produccion musical'
        );
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

module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    getItemsByArtist,
    saveSongData,
    deleteSongCtrl,
};
