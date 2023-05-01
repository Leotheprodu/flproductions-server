const express = require('express');
const router = express.Router();
const {
    registerCtrl,
    loginCtrl,
    logoutCtrl,
    ckeckSessCtrl,
    recoverPassword,
    sendPin,
} = require('../controllers/auth');
const {
    validatorLogin,
    validatorSignUp,
    validatorEmail,
    validatorRecoverPassword,
} = require('../validators/usuarios');
const checkEmailExist = require('../middleware/checkEmailExist');
const emailRateLimit = require('../middleware/emailRateLimit');
const rateLimiter = require('../config/rate-limit');
const { isLoggedInFalse, isLoggedInTrue } = require('../middleware/isLoggedIn');

/* SignUp Usuario */
router.post(
    '/signup',
    rateLimiter,
    isLoggedInFalse,
    checkEmailExist,
    emailRateLimit,
    validatorSignUp,
    registerCtrl
);
/* Login Usuario */
router.post('/login', rateLimiter, isLoggedInFalse, validatorLogin, loginCtrl);
/* Logout Usuario */
router.get('/logout', rateLimiter, isLoggedInTrue, logoutCtrl);
/* Revisa cuando entra un usuario si este esta, con la session activa, por si se desconecta que siga conectado */
router.get('/check-session', ckeckSessCtrl);
router.post(
    '/send-pin',
    isLoggedInFalse,
    emailRateLimit,
    validatorEmail,
    sendPin
); // seguridad: envio de correos limitado
router.post(
    '/recover-password',
    isLoggedInFalse,
    validatorRecoverPassword,
    recoverPassword
); // seguridad: envio de correos limitado

module.exports = router;
