const express = require('express');
const router = express.Router();
const { getItems } = require('../controllers/producciones');

/* Lista los items */
router.get('/', getItems);

module.exports = router;
