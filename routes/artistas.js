const express = require('express');
const router = express.Router();
const {
    getItems,
    createItem,
    getItem,
    updateItem,
    deleteItem,
} = require('../controllers/artistas');
const {
    validatorCreateItem,
    validatorGetItem,
    validatorUpdateItem,
} = require('../validators/artistas');
const { checkRoles } = require('../middleware/roles');
const rateLimiter = require('../config/rate-limit');
const { isLoggedInTrue } = require('../middleware/isLoggedIn');

/* Lista los items */
router.get('/', getItems);
/* Obtener Item */
router.get('/:id', rateLimiter, validatorGetItem, getItem);
/* Crea un registro */
router.post(
    '/',
    rateLimiter,
    validatorCreateItem,
    checkRoles([3, 4, 5]),
    createItem
);
/* Actualiza un Registro */
router.put(
    '/:id',
    isLoggedInTrue,
    rateLimiter,
    validatorGetItem,
    validatorUpdateItem,
    checkRoles([3, 4, 5]),
    updateItem
);
/* Eliminar Item */
router.delete(
    '/:id',
    rateLimiter,
    validatorGetItem,
    checkRoles([5]),
    deleteItem
);

module.exports = router;
