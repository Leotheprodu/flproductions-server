const express = require('express');
const router = express.Router();
const {
    getItems,
    getItem,
    updateItem,
    deleteItem,
    avatarCtrl,
    avatarUpdateCtrl,
    UserTypeCtrl,
} = require('../controllers/usuarios');
const {
    validatorGetItem,
    validatorAvatar,
    validatorUserType,
} = require('../validators/usuarios');
const { isLoggedInTrue } = require('../middleware/isLoggedIn');
const { checkRoles } = require('../middleware/roles');
const jsonToArrayBody = require('../middleware/jsonToArrayBody');

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
router.get('/avatar/:id', validatorGetItem, avatarCtrl);
router.post(
    '/avatar-update',
    isLoggedInTrue,
    checkRoles([1]),
    validatorAvatar,
    avatarUpdateCtrl
);
router.post(
    '/user-type',
    isLoggedInTrue,
    jsonToArrayBody,
    validatorUserType,
    checkRoles([1]),
    UserTypeCtrl
);

/**
 * Auth
 */

module.exports = router;
