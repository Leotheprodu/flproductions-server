const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorSignUp = [
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
const validatorLogin = [

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
    .isNumeric()
    .notEmpty(),
    
    (req, res, next) => validateResults(req, res, next)
    

];
module.exports = { validatorLogin, validatorGetItem, validatorSignUp };