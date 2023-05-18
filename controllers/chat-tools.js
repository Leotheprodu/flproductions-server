const { matchedData } = require('express-validator');
const {
    songNameGenerator,
    FLPChatRecordingStudio,
} = require('../config/openAi');
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
const FLPChatRecordingStudioCtrl = async (req, res) => {
    try {
        const { pregunta } = matchedData(req);
        const respuesta = await FLPChatRecordingStudio(req, pregunta);
        if (!respuesta) {
            handleHttpError(
                res,
                'Hay un problema con el chat de la seccion de preguntas y respuestas, intenta enviar directamente la pregunta en la parte de contactenos'
            );
            return;
        }
        res.send({ respuesta });
    } catch (error) {
        console.log(error);
        handleHttpError(
            res,
            'Hay un problema con el chat de la seccion de preguntas y respuestas, intenta enviar directamente la pregunta en la parte de contactenos'
        );
    }
};

module.exports = { songNameGeneratorCtrl, FLPChatRecordingStudioCtrl };
