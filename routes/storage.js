
const express = require("express");
const router = express.Router();
const uploadMiddleware = require('../utils/handleStorage');
const { createItem, getItems, getItem, deleteItem } = require('../controllers/storage');
const { validatorGetItem } = require("../validators/storage");


/* Lista los items */
router.get("/", getItems);
/* Obtener Item */
router.get("/:id",validatorGetItem, getItem);
/* Carga un archivo */
router.post('/', uploadMiddleware.single('myfile'), createItem);
/* Eliminar Item */
router.delete("/:id",validatorGetItem, deleteItem);






module.exports = router;