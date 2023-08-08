const { produccionesModel } = require('../models');
const { matchedData } = require('express-validator');
const { handleHttpError } = require('../utils/handleError');
const { Op } = require('sequelize');

/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItems = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 100;
        const types = req.query.types || null;
        const producciones = await produccionesModel.findAllData(
            page,
            pageSize,
            types
        );
        let totalCount = 0;
        if (types) {
            const typeList = types.split(',').map((type) => parseInt(type));
            totalCount = await produccionesModel.count({
                where: {
                    tipo_obra: {
                        [Op.in]: typeList,
                    },
                },
            });
        } else {
            totalCount = await produccionesModel.count();
        }
        const totalPages = Math.ceil(totalCount / pageSize); // Calcular el número total de páginas
        res.status(200).send({
            producciones,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
            },
        });
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
        console.log(songInfo.tipo_obra);
        if (
            req.session.artista.find((artist) => artist.id === song.id_artista)
        ) {
            if (song.tipo_obra === 1) {
                await song.update({ status: 0 });
                res.status(200).send({
                    message: 'Intrumental desactivado con exito',
                });
            } else {
                await song.destroy();
                res.status(200).send({
                    message: 'Cancion eliminada con exito',
                });
            }
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
            if (
                req.session.artista.find(
                    (artist) => artist.id === songData.id_artista
                )
            ) {
                await produccionesModel.update(songData, {
                    where: { id: songData.id },
                });
                res.status(200).send({
                    message: `cancion con id ${songData.id} actualizada con exito`,
                });
            }
        } catch (error) {
            if (
                req.session.artista.find(
                    (artist) => artist.id === songData.id_artista
                )
            ) {
                await produccionesModel.create({
                    ...songData,
                    destacado: 0,
                });
                res.status(200).send({ message: `cancion creada con exito` });
            }
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
