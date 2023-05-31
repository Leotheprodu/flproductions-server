const express = require('express');
const router = express.Router();
const { getItems, getItemsByArtist } = require('../controllers/producciones');
const { validatorId_artista } = require('../validators/producciones');

/* Lista los items */
router.get('/', getItems);
router.get('/artist/:id_artista', validatorId_artista, getItemsByArtist);

module.exports = router;
