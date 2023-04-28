const handleHttpError = (res, message = 'Algo ha salido mal', code = 403) => {
    res.status(code).send({ error: message });
};

module.exports = { handleHttpError };
