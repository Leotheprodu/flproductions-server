const fs = require('fs');
const { matchedData } = require('express-validator');
const { storageModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');

const PUBLIC_URL =
    process.env.NODE_ENV === 'production'
        ? process.env.PUBLIC_URL_PROD
        : process.env.PUBLIC_URL_DEV;
const MEDIA_PATH = `${__dirname}/../storage`;
/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItems = async (req, res) => {
    try {
        const data = await storageModel.findAll();
        res.status(200).send({ data });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al cargar los archivos');
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
        const data = await storageModel.findByPk(id);
        res.status(200).send({ data });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error con el detalle del item');
    }
};

/**
 * Insertar un registro!
 * @param {*} req
 * @param {*} res

*/
const createItem = async (req, res) => {
    try {
        const { file } = req;

        const fileData = {
            id: file.filename.split('.').shift(),
            filename: file.filename,
            url: `${PUBLIC_URL}/${file.filename}`,
            originalname: file.originalname.split('.').shift(),
            ext: file.filename.split('.').pop(),
            user_id: req.session.user.id,
        };

        const data = await storageModel.create(fileData);

        res.status(200).send({ data });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al guardar registro de archivo');
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
        const dataFile = await storageModel.findByPk(id);
        if (!dataFile) {
            return handleHttpError(res, 'id no encontrado');
        } else {
            if (
                dataFile.user_id === req.session.user.id ||
                req.session.roles.includes(5)
            ) {
                const { filename } = dataFile;
                const filePath = `${MEDIA_PATH}/${filename}`;
                const data = { filePath, deleted: 1 };
                fs.unlinkSync(filePath);
                await dataFile.destroy();
                res.status(200).send({ data });
            } else {
                return handleHttpError(
                    res,
                    'DONT_HAVE_PERMISSION_TO_DELETE',
                    401
                );
            }
        }
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al intentar eliminar el archivo');
    }
};

module.exports = { getItems, getItem, createItem, deleteItem };
