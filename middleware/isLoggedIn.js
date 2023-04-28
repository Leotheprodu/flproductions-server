const { handleHttpError } = require('../utils/handleError');

const isLoggedInTrue = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;

    if (isLoggedIn === true) {
        next();
    } else {
        handleHttpError(res, 'El usuario debe estar autenticado');
    }
};

const isLoggedInFalse = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;

    if (isLoggedIn === false || isLoggedIn === undefined) {
        next();
    } else {
        handleHttpError(res, 'El usuario no deberia estar logueado');
    }
};

module.exports = { isLoggedInTrue, isLoggedInFalse };
