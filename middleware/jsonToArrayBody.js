const { handleHttpError } = require('../utils/handleError');

const jsonToArrayBody = async (req, res, next) => {
    const roles = req.body.roles;
    try {
        if (Array.isArray(roles)) {
            next();
        } else {
            const arr = JSON.parse(roles);
            req.body.roles = arr;
            next();
        }
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_CONVERT_JSONTOARRAY');
    }
};

module.exports = jsonToArrayBody;
