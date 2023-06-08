const express = require('express');
const router = express.Router();
const {
    getItems,
    getItemsByArtist,
    saveSongData,
} = require('../controllers/producciones');
const {
    validatorId_artista,
    validatorHandleproduccion,
} = require('../validators/producciones');
const { isLoggedInTrue } = require('../middleware/isLoggedIn');

/* Lista los items */
router.get('/', getItems);
router.get(
    '/artist/:id_artista',
    isLoggedInTrue,
    validatorId_artista,
    getItemsByArtist
);
router.post('/handle', isLoggedInTrue, validatorHandleproduccion, saveSongData);

module.exports = router;
