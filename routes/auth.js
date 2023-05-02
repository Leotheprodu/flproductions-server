const express = require('express');
const router = express.Router();
const {
    registerCtrl,
    loginCtrl,
    logoutCtrl,
    ckeckSessCtrl,
    recoverPassword,
    sendPin,
    updateUsersCtrl,
    verifyEmailCtrl,
    emailVerifyCtrl,
} = require('../controllers/auth');
const {
    validatorLogin,
    validatorSignUp,
    validatorEmail,
    validatorRecoverPassword,
    validatorGetItem,
    validatorUpdateUsers,
    validatorGetEmail,
    validatorGetToken,
} = require('../validators/auth');
const checkEmailExist = require('../middleware/checkEmailExist');
const emailRateLimit = require('../middleware/emailRateLimit');
const rateLimiter = require('../config/rate-limit');
const { isLoggedInFalse, isLoggedInTrue } = require('../middleware/isLoggedIn');
const { checkNoRoles } = require('../middleware/roles');

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
router.get('/logout', isLoggedInTrue, logoutCtrl);
/* Revisa cuando entra un usuario si este esta, con la session activa, por si se desconecta que siga conectado */
router.get('/check-session', ckeckSessCtrl);
router.post(
    '/send-pin',
    isLoggedInFalse,
    emailRateLimit,
    validatorEmail,
    sendPin
);
router.post(
    '/recover-password',
    rateLimiter,
    isLoggedInFalse,
    validatorRecoverPassword,
    recoverPassword
);
router.put(
    '/update-users/:id',
    rateLimiter,
    emailRateLimit,
    isLoggedInTrue,
    validatorGetItem,
    validatorUpdateUsers,
    updateUsersCtrl
);
router.get(
    '/verify-email/:email',
    rateLimiter,
    emailRateLimit,
    isLoggedInTrue,
    checkNoRoles([1]),
    validatorGetEmail,
    verifyEmailCtrl
);
router.get('/email-verification/:token', validatorGetToken, emailVerifyCtrl);

module.exports = router;
