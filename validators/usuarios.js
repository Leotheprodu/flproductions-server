const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorGetItem = [
    check('id').exists().isNumeric().notEmpty(),

    (req, res, next) => validateResults(req, res, next),
];
const validatorAvatar = [
    check('avatar').exists().isNumeric().notEmpty(),
    check('id').exists().isNumeric().notEmpty(),

    (req, res, next) => validateResults(req, res, next),
];
const validatorUserType = [
    check('roles').exists().isArray().notEmpty(),
    check('id').exists().isNumeric().notEmpty(),

    (req, res, next) => validateResults(req, res, next),
];

module.exports = { validatorGetItem, validatorAvatar, validatorUserType };
