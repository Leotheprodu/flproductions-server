const { matchedData } = require('express-validator');
const { usuariosModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');
const { encrypt } = require('../utils/handlePassword');
const dateNow = require('../utils/handleFechaActual');
const { createTempToken, newToken } = require('../utils/handleTempToken');
const { sendAEmail } = require('../utils/handleSendEmail');


/**
 * Obtener la base de datos!
 * @param {*} req
 * @param {*} res

*/
const getItems = async (req, res) => {
    try {
        const data = await usuariosModel.findAll({
            attributes: {exclude: ['password']}
        });
    
        res.status(200).send({ data });

    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al cargar los usuarios');
    }
}

/**
 * Obtener un detalle!
 * @param {*} req
 * @param {*} res

*/
const getItem = async (req, res) => {
    try {
    
        const { id }  = matchedData(req);
        const data = await usuariosModel.findByPk(id, {
            attributes: {exclude: ['password']}
        });
        data.set('password', undefined, {strict: false});
        res.status(200).send({ data });

    } catch (error) {
        handleHttpError(res, 'Error al cargar el usuario');
    }
}

/**
 * Insertar un registro!
 * @param {*} req
 * @param {*} res

*/
const signUpUser = async (req, res) => {
    try {
        //Importa la data suministrada por el cliente ya filtrada
        req = matchedData(req);

        //Hashea el password del cliente
        const password = await encrypt(req.password);

        //Almacena la fecha actual en una variable
        const fechaActual = await dateNow();

        // Con spread operator agregamos los datos de la solicitud cambiando el password por el password hasheado y agregando la fecha actual 
        const body = {...req, password, fecha_creacion: fechaActual };

        // Aplica destructuring para tener a la mano estos valores
        const { username, email } = body;

        // Se agrega la info de body a la base de datos usuarios
        const data = await usuariosModel.create(body);

        //Se genera un token random
        const token = await newToken();

        //Crea el link que va a ser enviar al correo del nuevo usuario para verificar el email
        const link = `${process.env.NODE_ENV === 'production' ? process.env.LINK_PROD_HOST : process.env.LINK_DEV_HOST}/verificar-email/${token}`;

        // Crea el objeto con el nombre y correo del remitente del correo a enviar
        const from = { name: 'FLProductions', email: 'no-responder@flproductionscr.com' };

        // Crea el objeto con la data que necesita la plantilla para ser renderizada y enviada
        const dataToEJS = {username, link};

        // Agrega el token en la base de datos asignada al correo del usuario
        const guardarToken = await createTempToken(token, email, 'role');

        // Envia el correo a usuario para que se verifique
        const enviarCorreo = await sendAEmail( 'user-sign_up', dataToEJS, from, email, 'Verifique su correo' );

        // Con esta linea cuando se registra no devuelve en password en la respuesta
        data.set('password', undefined, {strict: false});

        //Respuesta
        res.status(200).send({ data, guardarToken, enviarCorreo });
        
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al crear el usuario');
    };
};



/**
 * Actualizar un registro!
 * @param {*} req
 * @param {*} res

*/
const updateItem = async (req, res) => {

}

/**
 * Eliminar un registro!
 * @param {*} req
 * @param {*} res

*/
const deleteItem = async (req, res) => {

}

module.exports = { getItems, getItem, signUpUser, updateItem, deleteItem };