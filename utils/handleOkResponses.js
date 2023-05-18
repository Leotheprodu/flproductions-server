/**
 * Respuesta para enviar toda la informacion de la sesion actual del usuario
 * @param {*} req
 * @param {*} res
 * @param {'mensaje de la respuesta'} message
 */
const resUsersSessionData = (req, res, message) => {
    res.send({
        isLoggedIn: true,
        user: req.session.user,
        roles: req.session.roles,
        artista: req.session.artista,
        userMessage: {
            message,
        },
    });
};
/**
 * Respuesta para enviar unicamente datos para mostrar al cliente
 * @param {*} res
 * @param {object} data
 */
const resOkData = (res, data) => {
    res.send({
        ...data,
    });
};

module.exports = { resUsersSessionData, resOkData };
