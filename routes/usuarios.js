const express = require("express");
const router = express.Router();
const { getItems, registerCtrl, getItem, updateItem, deleteItem, loginCtrl, logoutCtrl, ckeckSessCtrl } = require("../controllers/usuarios");
const { validatorLogin, validatorGetItem, validatorSignUp } = require("../validators/usuarios");
const checkEmailExist = require("../middleware/checkEmailExist");
const emailRateLimit = require("../middleware/emailRateLimit");
const rateLimiter = require("../config/rate-limit");
const { isLoggedInFalse, isLoggedInTrue } = require("../middleware/isLoggedin");
const { checkRoles } = require("../middleware/roles");




/* Lista los items */
router.get("/",checkRoles([2]), getItems);
/* Obtener Item */
router.get("/:id",validatorGetItem,checkRoles([2,5]), getItem);
/* Actualiza un Registro */
router.put("/:id",validatorGetItem,checkRoles([5]), updateItem);
/* Eliminar Item */
router.delete("/:id", validatorGetItem,checkRoles([5]), deleteItem);


/**
 * Auth
*/

module.exports = router;