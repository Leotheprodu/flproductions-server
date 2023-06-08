const { validationResult } = require('express-validator');

const validateResults = (req, res, next) => {
    try {
        validationResult(req).throw();
        return next();
    } catch (err) {
        console.error(err);
        res.status(403);
        res.send({
            error: err.array(),
            message:
                'Revisa que los campos del formulario cumplan los requisitos',
        });
    }
};
module.exports = validateResults;
