const { matchedData } = require('express-validator');
const { usuariosModel, temp_token_poolModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');
const { encrypt, compare } = require('../utils/handlePassword');
const dateNow = require('../utils/handleFechaActual');
const {
    createTempToken,
    newToken,
    deleteTempToken,
} = require('../utils/handleTempToken');
const { sendAEmail } = require('../utils/handleSendEmail');
const { refreshUserRoles } = require('../utils/handleRoles');
const registerCtrl = async (req, res) => {
    try {
        //Importa la data suministrada por el cliente ya filtrada
        req = matchedData(req);

        //Hashea el password del cliente
        const password = await encrypt(req.password);

        //Almacena la fecha actual en una variable
        const fechaActual = await dateNow();

        // Con spread operator agregamos los datos de la solicitud cambiando el password por el password hasheado y agregando la fecha actual
        const body = { ...req, password, fecha_creacion: fechaActual };

        // Aplica destructuring para tener a la mano estos valores
        const { username, email } = body;

        // Se agrega la info de body a la base de datos usuarios
        const data = await usuariosModel.create(body);

        //Se genera un token random
        const token = await newToken();

        //Crea el link que va a ser enviar al correo del nuevo usuario para verificar el email
        const link = `${process.env.LINK_HOST}/verificar-email/${token}`;

        // Crea el objeto con el nombre y correo del remitente del correo a enviar
        const from = {
            name: 'FLProductions',
            email: 'no-responder@flproductionscr.com',
        };

        // Crea el objeto con la data que necesita la plantilla para ser renderizada y enviada
        const dataToEJS = { username, link };

        // Agrega el token en la base de datos asignada al correo del usuario
        const guardarToken = await createTempToken(token, email, 'role');

        // Envia el correo a usuario para que se verifique
        const enviarCorreo = await sendAEmail(
            'user-sign_up',
            dataToEJS,
            from,
            email,
            'Verifique su correo'
        );

        // Con esta linea cuando se registra no devuelve en password en la respuesta
        data.set('password', undefined, { strict: false });

        //Respuesta
        res.status(200).send({ data, guardarToken, enviarCorreo });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al crear el usuario');
    }
};

const loginCtrl = async (req, res) => {
    try {
        if (req.session.isLoggedIn) {
            res.status(200).send({
                message: 'Has Iniciado Sesion!',
                isLoggedIn: true,
                user: req.session.user,
                roles: req.session.roles,
            });
            return;
        }
        //Importa la data suministrada por el cliente ya filtrada
        const datosLimpios = matchedData(req);
        const { email, password } = datosLimpios;
        //Hashea el password del cliente
        //extrae datos del usuario
        const datosUsuario = await usuariosModel.scope('withPassword').findOne({
            where: { email },
        });
        if (!datosUsuario) {
            handleHttpError(res, 'El Usuario no existe', 404);
            return;
        }
        if (datosUsuario.activo === 0) {
            handleHttpError(res, 'El usuario fue eliminado', 401);
            return;
        }
        const hashPassword = await datosUsuario.password;
        const check = await compare(password, hashPassword);
        if (!check) {
            handleHttpError(res, 'Password invalido', 401);
            return;
        }
        if (process.env.NODE_ENV === 'production') {
            res.cookie('sessionId', req.session.id, {
                httpOnly: true,
                secure: true,
                maxAge: 3600000,
            });
        } else {
            res.cookie('sessionId', req.session.id, {
                httpOnly: true,
                secure: false,
                maxAge: 3600000,
            });
        }

        const datoUsuarioSinPassword = await usuariosModel.findOne({
            where: { email },
        });
        req.session.isLoggedIn = true;
        req.session.roles = await refreshUserRoles(datosUsuario.id);
        req.session.user = datoUsuarioSinPassword;
        res.status(200).send({
            message: 'Inicio de sesión exitoso!',
            isLoggedIn: true,
            user: req.session.user,
            roles: req.session.roles,
        });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al autentificar el usuario');
    }
};
const logoutCtrl = async (req, res) => {
    try {
        req.session.isLoggedIn = false;
        res.status(200).json({
            message: 'Cierre de sesión exitoso!',
            isLoggedIn: false,
            user: req.session.user,
            roles: req.session.roles,
        });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al intenta desloguear al usuario');
    }
};
const ckeckSessCtrl = async (req, res) => {
    try {
        if (req.session.isLoggedIn) {
            req.session.user = await usuariosModel.findByPk(
                req.session.user.id
            );
            req.session.roles = await refreshUserRoles(req.session.user.id);
            res.status(200).send({
                message: 'El usuario ha iniciado sesion',
                isLoggedIn: true,
                user: req.session.user,
                roles: req.session.roles,
            });
        } else {
            res.status(200).send({
                message: 'El usuario no ha iniciado sesion',
            });
        }
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'ERROR_CHECK_SESSION');
    }
};

const sendPin = async (req, res) => {
    try {
        const { email } = matchedData(req);
        const token = await newToken();
        const datosUsuario = await usuariosModel.findOne({
            where: { email },
        });
        if (!datosUsuario) return handleHttpError(res, 'USER_NOT_FOUND');
        await createTempToken(token, email, 'password');
        const from = {
            name: 'FLProductions',
            email: 'no-responder@flproductionscr.com',
        };
        const dataToEJS = { token };
        await sendAEmail(
            'user-recuperar-password',
            dataToEJS,
            from,
            email,
            'PIN para recuperar contraseña'
        );

        setTimeout(() => {
            deleteTempToken(token, email, 'password');
        }, 600000);
        res.send({ message: 'PIN_SENT' });
    } catch (error) {
        handleHttpError(res, 'Error al intenta recuperar password');
    }
};
const recoverPassword = async (req, res) => {
    try {
        const { email, password, pin } = matchedData(req);
        const data = await temp_token_poolModel.findOne({
            where: { token: pin },
        });

        if (!data) return handleHttpError(res, 'INVALID_PIN');
        const hashPassword = await encrypt(password);

        const user = await usuariosModel.findOne({
            where: { email },
        });
        await user.update({ password: hashPassword });
        await data.destroy();

        res.send({ message: 'PASSWORD_UPDATED' });
    } catch (error) {
        handleHttpError(res, 'Error al intenta recuperar password');
    }
};

module.exports = {
    registerCtrl,
    loginCtrl,
    logoutCtrl,
    ckeckSessCtrl,
    sendPin,
    recoverPassword,
};
