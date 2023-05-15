const express = require('express');
const router = express.Router();
const {
    getItems,
    createItem,
    getItem,
    updateItem,
    deleteItem,
    createArtistCtrl,
    updateArtistImageCtrl,
} = require('../controllers/artistas');
const {
    validatorCreateItem,
    validatorGetItem,
    validatorUpdateItem,
    validatorCreateArtist,
} = require('../validators/artistas');
const { checkRoles } = require('../middleware/roles');
const rateLimiter = require('../config/rate-limit');
const { isLoggedInTrue } = require('../middleware/isLoggedIn');
const { uploadMiddleware, resizeImage } = require('../utils/handleStorage');
const stringToInteger = require('../middleware/stringToInteger');
const {
    checkSingleArtist,
    checkArtistExist,
} = require('../middleware/checkSingleArtista');

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
router.post(
    '/create-artist',
    checkSingleArtist,
    isLoggedInTrue,
    checkRoles([3, 4]),
    uploadMiddleware(['jpg', 'aviff', 'webp', 'png']).single('imagen'),
    checkArtistExist,
    resizeImage,
    stringToInteger(['tipo']),
    validatorCreateArtist,
    createArtistCtrl
);
router.put(
    '/update-artist/image',
    isLoggedInTrue,
    checkRoles([3, 4]),
    uploadMiddleware(['jpg', 'aviff', 'webp', 'png']).single('imagen'),
    resizeImage,
    updateArtistImageCtrl
);

module.exports = router;
