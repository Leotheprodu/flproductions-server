const express = require("express");
const router = express.Router();
const { getItems, createItem, getItem, updateItem, deleteItem } = require("../controllers/artistas");
const { validatorCreateItem, validatorGetItem } = require("../validators/artistas");
const { checkRoles } = require("../middleware/roles");
const rateLimiter = require("../config/rate-limit");

/* Lista los items */
router.get("/",rateLimiter, getItems);
/* Obtener Item */
router.get("/:id", rateLimiter, validatorGetItem,checkRoles([3,4,5]), getItem);
/* Crea un registro */
router.post("/", rateLimiter, validatorCreateItem, checkRoles([3,4,5]), createItem);
/* Actualiza un Registro */
router.put("/:id", rateLimiter,validatorGetItem, validatorCreateItem,checkRoles([3,4,5]), updateItem);
/* Eliminar Item */
router.delete("/:id", rateLimiter, validatorGetItem,checkRoles([5]), deleteItem);  

  module.exports = router;