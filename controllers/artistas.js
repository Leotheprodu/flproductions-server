const { matchedData } = require('express-validator');
const { artistasModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');
const { storageModel } = require('../models');
const { RefreshSessionData } = require('../utils/handleRefreshSessionData');
const { resOkData } = require('../utils/handleOkResponses');
const PUBLIC_URL = process.env.PUBLIC_URL;
const fs = require('fs');
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
const createArtistCtrl = async (req, res) => {
    try {
        const { file } = req;
        const { nombre_artista, instagram, spotify, info, tipo } =
            matchedData(req);
        const fileData = {
            id: file.filename.split('.').shift(),
            filename: file.filename,
            url: `${PUBLIC_URL}/${req.session.user.id}/${file.filename}`,
            originalname: file.originalname.split('.').shift(),
            ext: file.filename.split('.').pop(),
            user_id: req.session.user.id,
        };
        const artistData = {
            nombre_artista,
            instagram,
            spotify,
            info,
            tipo,
            imagen: fileData.url,
            user_id: fileData.user_id,
        };

        await artistasModel.create(artistData);
        await storageModel.create(fileData);
        await RefreshSessionData(req);
        resOkData(res, artistData);
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al crear artista');
    }
};
const updateArtistImageCtrl = async (req, res) => {
    try {
        const { file } = req;
        const fileData = {
            id: file.filename.split('.').shift(),
            filename: file.filename,
            url: `${PUBLIC_URL}/${req.session.user.id}/${file.filename}`,
            originalname: file.originalname.split('.').shift(),
            ext: file.filename.split('.').pop(),
            user_id: req.session.user.id,
        };
        const userId = req.session.user.id;
        const artist = await artistasModel.findOne({
            where: { user_id: userId },
        });
        if (!artist) {
            const imagenCargada = `${__dirname}/../storage/${userId}/${file.filename}`;
            fs.unlinkSync(imagenCargada);
            handleHttpError(res, 'No Existe el Artista');
            return;
        }
        const lastImage = await storageModel.findOne({
            where: { url: artist.imagen },
        });
        if (!lastImage) {
            await artist.update({
                imagen: fileData.url,
            });
            await storageModel.create(fileData);
            resOkData(res, { imagen: fileData.url });
            return;
        }
        const MEDIA_PATH = `${__dirname}/../storage/${userId}`;
        const filePath = `${MEDIA_PATH}/${lastImage.filename}`;
        fs.unlinkSync(filePath);
        await lastImage.destroy();
        await artist.update({
            imagen: fileData.url,
        });
        await storageModel.create(fileData);
        resOkData(res, { imagen: fileData.url });
    } catch (error) {
        console.error(error);
        const { file } = req;
        const imagenCargada = `${__dirname}/../storage/${req.session.user.id}/${file.filename}`;
        fs.unlinkSync(imagenCargada);
        handleHttpError(res, 'Error al actualizar imagen de artista');
    }
};

module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    createArtistCtrl,
    updateArtistImageCtrl,
};
