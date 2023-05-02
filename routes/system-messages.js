const express = require('express');
const router = express.Router();
const { getItems } = require('../controllers/mensajes_generales');

/* Lista los items */
router.get('/', getItems);

module.exports = router;
