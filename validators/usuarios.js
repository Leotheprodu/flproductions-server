const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorCreateItem = [
    check('username')
    .exists()
    .notEmpty()
    .isLength({min:3, max:20}),
    
    check('email')
    .exists()
    .notEmpty()
    .isEmail(),

    check('password')
    .exists()
    .notEmpty()
    .isString(),
    
    (req, res, next) => validateResults(req, res, next)
    

];

const validatorGetItem = [
    
    check('id')
    .exists()
    .notEmpty(),
    
    (req, res, next) => validateResults(req, res, next)
    

];
module.exports = { validatorCreateItem, validatorGetItem };