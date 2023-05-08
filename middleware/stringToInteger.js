const { handleHttpError } = require('../utils/handleError');
/**
 *
 * @param {['item1', 'item2']} campos
 * @returns
 */
const stringToInteger = (campos) => (req, res, next) => {
    try {
        const camposToInt = campos.map((name) => {
            const valor = req.body[name];
            const valorInt = parseInt(valor);
            return [name, valorInt];
        });
        camposToInt.forEach(([name, valorInt]) => {
            req.body[name] = valorInt;
        });
        next();
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_CONVERT_STRING_TO_INT');
    }
};

module.exports = stringToInteger;
