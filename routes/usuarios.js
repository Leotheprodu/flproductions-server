const express = require("express");
const router = express.Router();
const { getItems, signUpUser, getItem, updateItem, deleteItem } = require("../controllers/usuarios");
const { validatorCreateItem, validatorGetItem } = require("../validators/usuarios");
const checkEmailExist = require("../middleware/checkEmailExist");
const emailRateLimit = require("../config/nodemailer/emailRateLimit");
const rateLimiter = require("../config/rate-limit");
const { isLoggedInFalse } = require("../middleware/isLoggedin");


/* Lista los items */
router.get("/", getItems);
/* Obtener Item */
router.get("/:id",validatorGetItem, getItem);
/* Registra un Usuario */
router.post("/signup", isLoggedInFalse, rateLimiter, validatorCreateItem, checkEmailExist, emailRateLimit, signUpUser);
/* Actualiza un Registro */
router.put("/:id",validatorGetItem, validatorCreateItem, updateItem);
/* Eliminar Item */
router.delete("/:id", validatorGetItem, deleteItem);
  

  module.exports = router;