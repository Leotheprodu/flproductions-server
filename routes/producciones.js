const express = require('express');
const router = express.Router();
const {
    getItems,
    getItemsByArtist,
    saveSongData,
    deleteSongCtrl,
} = require('../controllers/producciones');
const {
    validatorId_artista,
    validatorHandleproduccion,
    validatorDeleteSong,
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
router.delete('/delete', isLoggedInTrue, validatorDeleteSong, deleteSongCtrl);
module.exports = router;
