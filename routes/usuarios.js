const express = require('express');
const router = express.Router();
const {
    getItems,
    getItem,
    updateItem,
    deleteItem,
} = require('../controllers/usuarios');
const { validatorGetItem } = require('../validators/usuarios');

const { isLoggedInTrue } = require('../middleware/isLoggedIn');
const { checkRoles } = require('../middleware/roles');

/* Lista los items */
router.get('/', isLoggedInTrue, checkRoles([2]), getItems);
/* Obtener Item */
router.get(
    '/:id',
    isLoggedInTrue,
    checkRoles([2, 5]),
    validatorGetItem,
    getItem
);
/* Actualiza un Registro */
router.put(
    '/:id',
    isLoggedInTrue,
    checkRoles([5]),
    validatorGetItem,
    updateItem
);
/* Eliminar Item */
router.delete(
    '/:id',
    isLoggedInTrue,
    checkRoles([2, 5]),
    validatorGetItem,
    deleteItem
);

/**
 * Auth
 */

module.exports = router;
