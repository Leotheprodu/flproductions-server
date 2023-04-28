const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorCreateItem = [
    check('nombre_artista').exists().notEmpty().isLength({ min: 2, max: 20 }),

    check('instagram').optional().isString(),

    check('spotify').optional().isString(),

    check('imagen').optional().isString(),

    check('info').optional().isString(),

    check('tipo')
        .exists()
        .notEmpty()
        .isIn(['0', '1'])
        .withMessage('El campo debe ser 0 o 1 (0: productores, 1: cantantes)'),

    (req, res, next) => validateResults(req, res, next),
];

const validatorGetItem = [
    check('id').exists().notEmpty(),

    (req, res, next) => validateResults(req, res, next),
];
module.exports = { validatorCreateItem, validatorGetItem };
