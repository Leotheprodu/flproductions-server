const { matchedData } = require('express-validator');
const { songNameGenerator } = require('../config/openAi');
const { handleHttpError } = require('../utils/handleError');

/**
 * Obtener un detalle!
 * @param {*} req
 * @param {*} res

*/
const songNameGeneratorCtrl = async (req, res) => {
    try {
        const datos = matchedData(req);
        const Nombre_de_Cancion = await songNameGenerator(datos);
        res.send({ Nombre_de_Cancion });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'HUBO_UN_PROBLEMA');
    }
};

module.exports = { songNameGeneratorCtrl };
