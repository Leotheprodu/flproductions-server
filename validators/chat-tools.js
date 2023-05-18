const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorSongIdeas = [
    check('genero').exists().isString().notEmpty(),
    check('letra').exists().isString().notEmpty(),

    (req, res, next) => validateResults(req, res, next),
];
const validatorFaq = [
    check('pregunta').exists().isString().notEmpty(),

    (req, res, next) => validateResults(req, res, next),
];

module.exports = { validatorSongIdeas, validatorFaq };
