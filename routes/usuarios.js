const express = require("express");
const router = express.Router();
const { getItems, registerCtrl, getItem, updateItem, deleteItem, loginCtrl, logoutCtrl, ckeckSessCtrl } = require("../controllers/usuarios");
const { validatorLogin, validatorGetItem, validatorSignUp } = require("../validators/usuarios");
const checkEmailExist = require("../middleware/checkEmailExist");
const emailRateLimit = require("../middleware/emailRateLimit");
const rateLimiter = require("../config/rate-limit");
const { isLoggedInFalse, isLoggedInTrue } = require("../middleware/isLoggedin");

/* SignUp Usuario */
router.post("/signup",rateLimiter, isLoggedInFalse, checkEmailExist, emailRateLimit, validatorSignUp, registerCtrl);
/* Login Usuario */
router.post("/login",rateLimiter, isLoggedInFalse, validatorLogin, loginCtrl);
/* Logout Usuario */
router.get("/logout",rateLimiter, isLoggedInTrue, logoutCtrl);
router.get("/check-session", rateLimiter, ckeckSessCtrl);


/* Lista los items */
router.get("/", getItems);
/* Obtener Item */
router.get("/:id",validatorGetItem, getItem);
/* Actualiza un Registro */
router.put("/:id",validatorGetItem, updateItem);
/* Eliminar Item */
router.delete("/:id", validatorGetItem, deleteItem);


/**
 * Auth
*/

module.exports = router;