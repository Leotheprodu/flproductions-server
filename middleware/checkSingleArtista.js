const { artistasModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');

const checkSingleArtist = async (req, res, next) => {
    try {
        const checkArtist = await artistasModel.findOne({
            where: { user_id: req.session.user.id },
        });
        if (checkArtist) {
            return handleHttpError(res, 'El Usuario ya tiene un artista');
        } else {
            next();
        }
    } catch (error) {
        next();
    }
};
const checkArtistExist = async (req, res, next) => {
    const { nombre_artista } = req.body;
    try {
        const checkExist = await artistasModel.findOne({
            where: { nombre_artista },
        });
        if (checkExist) {
            return handleHttpError(res, 'El Artista ya existe');
        } else {
            next();
        }
    } catch (error) {
        next();
    }
};
module.exports = { checkSingleArtist, checkArtistExist };
