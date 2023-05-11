const { artistasModel, usuariosModel } = require('../models/');
const { refreshUserRoles } = require('./handleRoles');
const RefreshSessionData = async (req) => {
    const id = req.session.user.id;
    req.session.artista =
        (await artistasModel.findAll({
            where: { user_id: id },
        })) || null;
    const data = await usuariosModel.findByPk(id, {
        attributes: { exclude: ['password'] },
    });
    req.session.user = data;
    req.session.roles = await refreshUserRoles(data.id);
};

module.exports = { RefreshSessionData };
