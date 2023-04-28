const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorCreateItem = [
    check('filename').optional().isString(),

    check('url').optional().isString(),

    (req, res, next) => validateResults(req, res, next),
];

const validatorGetItem = [
    check('id').exists().notEmpty(),

    (req, res, next) => validateResults(req, res, next),
];
module.exports = { validatorCreateItem, validatorGetItem };
