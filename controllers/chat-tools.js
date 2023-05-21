const { matchedData } = require('express-validator');
const {
    songNameGenerator,
    FLPChatRecordingStudio,
} = require('../config/openAi');
const { handleHttpError } = require('../utils/handleError');
const { chat_faqModel } = require('../models');

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
        const { pregunta, other_user_id } = matchedData(req);
        const respuesta = await FLPChatRecordingStudio(req, pregunta);
        /* const respuesta = `respuesta del chatgpt ${Date.now()}`; */
        if (!respuesta) {
            handleHttpError(
                res,
                'Hay un problema con el chat de la seccion de preguntas y respuestas, intenta enviar directamente la pregunta en la parte de contactenos'
            );
            return;
        }

        await chat_faqModel.create({
            pregunta,
            respuesta,
            user_id: req.session.user.id,
            other_user_id,
        });
        res.send({ respuesta });
    } catch (error) {
        console.log(error);
        handleHttpError(
            res,
            'Hay un problema con el chat de la seccion de preguntas y respuestas, intenta enviar directamente la pregunta en la parte de contactenos'
        );
    }
};
const ShowResponsesCtrl = async (req, res) => {
    try {
        const user_id = req.session.user.id;
        const data = await chat_faqModel.findAll({ where: { user_id } });
        if (!data) {
            handleHttpError(res, 'El Usuario no ha iniciado una conversacion');
        }
        res.send(data);
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'hubo un problema al cargar el chat');
    }
};

module.exports = {
    songNameGeneratorCtrl,
    FLPChatRecordingStudioCtrl,
    ShowResponsesCtrl,
};
