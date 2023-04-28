const crypto = require('crypto');
const { temp_token_poolModel } = require('../models');

const newToken = async () => {
    try {
        return crypto.randomBytes(32).toString('hex');
    } catch (error) {
        throw new Error(`hubo un problema al generar el token`);
    }
};
/**
 * aqui pasa el token, email del usuario y el tipo de registro
 * @param {*} token
 * @param {*} user_email
 * @param {*} type
 */
const createTempToken = async (token, user_email, type) => {
    const temp_token = await temp_token_poolModel.create({
        token,
        user_email,
        type,
    });
    const message = {
        message: 'token temporal guardado existosamente',
        temp_token,
    };
    return message;
};

const deleteTempToken = async (token, user_email, type) => {
    try {
        const temp_token = await temp_token_poolModel.findOne({
            where: { user_email, type, token },
        });

        await temp_token.destroy();
        const message = {
            message: 'token temporal eliminado existosamente',
            temp_token,
        };
        return message;
    } catch (error) {
        console.log(error);
    }
};

module.exports = { newToken, createTempToken, deleteTempToken };
