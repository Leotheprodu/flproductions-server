/**
 * siempre debe poner el res, el mensaje del error y el codigo de error por default es 403: no autorizado
 * @param {*} res
 * @param {*} message
 * @param {*} code
 */
const handleHttpError = (res, message = 'Algo ha salido mal', code = 403) => {
    res.status(code).send({ message });
};

module.exports = { handleHttpError };
