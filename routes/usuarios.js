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
router.get("/",isLoggedInTrue, checkRoles([2]), getItems);
/* Obtener Item */
router.get("/:id",isLoggedInTrue,checkRoles([2,5]), validatorGetItem, getItem);
/* Actualiza un Registro */
router.put("/:id",isLoggedInTrue, checkRoles([5]), validatorGetItem, updateItem);
/* Eliminar Item */
router.delete("/:id", isLoggedInTrue, checkRoles([2,5]), validatorGetItem, deleteItem);


/**
 * Auth
*/

module.exports = router;