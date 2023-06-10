const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorId_artista = [
    check('id_artista').exists().notEmpty(),

    (req, res, next) => validateResults(req, res, next),
];
const validatorDeleteSong = [
    check('id').exists().notEmpty(),
    check('nombre').exists().notEmpty().isString(),

    (req, res, next) => validateResults(req, res, next),
];
const validatorHandleproduccion = [
    check('id').optional(),
    check('nombre').exists().notEmpty().isString(),
    check('descripcion').exists().notEmpty().isString(),
    check('id_artista').exists(),
    check('spotify_link').optional(),
    check('youtube_id').exists().notEmpty().isString(),
    check('destacado').optional(),
    check('tipo_obra').optional(),
    check('estilo').exists().notEmpty().isString(),
    check('genero').exists().notEmpty().isString(),
    check('bpm').optional(),
    check('key').optional(),
    check('fecha_lanzamiento').exists().notEmpty().isDate(),

    (req, res, next) => validateResults(req, res, next),
];

module.exports = {
    validatorId_artista,
    validatorHandleproduccion,
    validatorDeleteSong,
};
