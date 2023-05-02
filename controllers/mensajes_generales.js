const { handleHttpError } = require('../utils/handleError');
const { mensajes_generalesModel } = require('../models');
/**
 * Obtener un detalle!
 * @param {*} req
 * @param {*} res

*/
const getItems = async (req, res) => {
    try {
        const data = await mensajes_generalesModel.findAll();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'HUBO_UN_PROBLEMA');
    }
};

module.exports = { getItems };
