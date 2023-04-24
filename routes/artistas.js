const express = require("express");
const router = express.Router();
const { getItems, createItem, getItem, updateItem, deleteItem } = require("../controllers/artistas");
const { validatorCreateItem, validatorGetItem } = require("../validators/artistas");
const { checkRoles } = require("../middleware/roles");


/* Lista los items */
router.get("/", getItems);
/* Obtener Item */
router.get("/:id", validatorGetItem,checkRoles([3,4,5]), getItem);
/* Crea un registro */
router.post("/", validatorCreateItem, checkRoles([3,4,5]), createItem);
/* Actualiza un Registro */
router.put("/:id",validatorGetItem, validatorCreateItem,checkRoles([3,4,5]), updateItem);
/* Eliminar Item */
router.delete("/:id", validatorGetItem,checkRoles([5]), deleteItem);  

  module.exports = router;