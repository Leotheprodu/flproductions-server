const { usuariosModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');

const checkEmailExist = async (req, res, next) => {
    const email = req.body.email;
    const consultaBD = await usuariosModel.findOne({
        where: { email },
    });

    if (consultaBD === null) {
        next();
    } else {
        handleHttpError(res, 'EL EMAIL YA ESTA REGISTRADO');
    }
};

module.exports = checkEmailExist;
