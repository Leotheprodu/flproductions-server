const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorId_artista = [
    check('id_artista').exists().notEmpty(),

    (req, res, next) => validateResults(req, res, next),
];

module.exports = {
    validatorId_artista,
};
