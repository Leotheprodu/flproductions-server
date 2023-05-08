const express = require('express');
const router = express.Router();
const { uploadMiddleware } = require('../utils/handleStorage');
const {
    createItem,
    getItems,
    getItem,
    deleteItem,
} = require('../controllers/storage');
const { validatorGetItem } = require('../validators/storage');
const ratelimiter = require('../config/rate-limit');
const { isLoggedInTrue } = require('../middleware/isLoggedIn');
const { checkRoles } = require('../middleware/roles');

/* Lista los items */
router.get('/', getItems);
/* Obtener Item */
router.get('/:id', validatorGetItem, getItem);
/* Carga un archivo */
router.post(
    '/',
    ratelimiter,
    isLoggedInTrue,
    checkRoles([3, 4, 5, 6]),
    uploadMiddleware(['wav', 'mp3', 'zip', 'rar', 'jpg', 'png']).single(
        'myfile'
    ),
    createItem
);
/* Eliminar Item */
router.delete(
    '/:id',
    validatorGetItem,
    isLoggedInTrue,
    checkRoles([3, 4, 5, 6]),
    deleteItem
);

module.exports = router;
