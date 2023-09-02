const { matchedData } = require('express-validator');
const {
    usuariosModel,
    temp_token_poolModel,
    role_usersModel,
    avatar_usersModel,
} = require('../models');
const { handleHttpError } = require('../utils/handleError');
const { encrypt, compare } = require('../utils/handlePassword');
const dateNow = require('../utils/handleFechaActual');
const {
    createTempToken,
    newToken,
    deleteTempToken,
    deleteTempNoToken,
} = require('../utils/handleTempToken');
const { sendAEmail } = require('../utils/handleSendEmail');
const { RefreshSessionData } = require('../utils/handleRefreshSessionData');
const { resUsersSessionData } = require('../utils/handleOkResponses');
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
            email: `${process.env.EMAIL_CRED_NORESP_USER}`,
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
        if (req.role && data) {
            await role_usersModel.create({ user_id: data.id, role_id: 3 });
        }
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
            resUsersSessionData(req, res, 'Ya has iniciado Sesion');
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
                maxAge: 3600000 * 24,
                sameSite: 'none',
            });
        } else {
            res.cookie('sessionId', req.session.id, {
                httpOnly: true,
                secure: false,
                maxAge: 3600000 * 24,
            });
        }
        req.session.user = datosUsuario;
        req.session.isLoggedIn = true;
        await RefreshSessionData(req);
        resUsersSessionData(req, res, 'Inicio de Sesion existoso');
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al autentificar el usuario');
    }
};
const logoutCtrl = async (req, res) => {
    try {
        req.session.isLoggedIn = false;
        resUsersSessionData(req, res, 'Cierre de Sesion existoso');
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al intenta desloguear al usuario');
    }
};
const ckeckSessCtrl = async (req, res) => {
    try {
        if (req.session.isLoggedIn) {
            await RefreshSessionData(req);
            resUsersSessionData(
                req,
                res,
                'Session Iniciada, Datos Actualizados'
            );
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
            email: `${process.env.EMAIL_CRED_NORESP_USER}`,
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
const updateUsersCtrl = async (req, res) => {
    try {
        //Importa la data suministrada por el cliente ya filtrada
        const { id, username, email, password } = matchedData(req);
        //traemos la info del usuario desde la bd.
        const userDB = await usuariosModel.findByPk(id);
        //se asegura que solo el usuario o un admin pueda actializar informacion del usuario.
        if (parseInt(id) !== req.session.user.id)
            return handleHttpError(res, 'NO_PERMISSION');

        //comprobamos si el usuario ha cambiado el email.
        if (email !== req.session.user.email) {
            const token = await newToken();
            const link = `${process.env.LINK_HOST}/verificar-email/${token}`;
            const from = {
                name: 'FLProductions',
                email: `${process.env.EMAIL_CRED_NORESP_USER}`,
            };
            const dataToEJS = { username: req.session.user.username, link };

            // con este  trycatch se evalua si el usuario ya estaba verificado, si lo estaba, va a borrar el verificado, el avatar, crea el temp token, actualiza el nuevo email, y si no esta verificado, solo actualiza el nuevo email y creal el temp token.
            try {
                const verificado = await role_usersModel.findOne({
                    where: { user_id: id, role_id: 1 },
                });

                verificado.destroy();
                await userDB.update({ email });
                await createTempToken(token, email, 'role');
                const avatarUser = await avatar_usersModel.findOne({
                    where: { user_id: id },
                });
                avatarUser.destroy();
            } catch (error) {
                await userDB.update({ email });
                await createTempToken(token, email, 'role');
            }
            //envia el email con el token para ser verificado al nuevo email.
            await sendAEmail(
                'user-verificar_correo',
                dataToEJS,
                from,
                email,
                'Verifique su correo'
            );
        }
        //comprueba que el usuario haya cambiado la contraseña y si lo hizo se actualiza en la BD.
        if (password && password.length > 2) {
            const hashPassword = await encrypt(password);
            await userDB.update({ password: hashPassword });
        }
        //comprueba si ha cambiado el username, si lo hizo, que lo actualice.
        if (username !== req.session.user.username && username.length > 2) {
            await userDB.update({ username });
        }

        //traemos toda la info del usuario actualizada
        const userActualizado = await usuariosModel.findByPk(id);
        //actualizamos la info de sesion
        req.session.user = userActualizado;
        //respondemos la solicitud
        res.send({
            message: 'actualizado con exito',
            user: userActualizado,
        });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'Error al Actualizar usuario el usuario');
    }
};
const verifyEmailCtrl = async (req, res) => {
    try {
        const { email } = matchedData(req);
        if (email !== req.session.user.email)
            return handleHttpError(res, 'NO_PERMISSION');
        const token = await newToken();
        await deleteTempNoToken(email, 'role');
        await createTempToken(token, email, 'role');
        const link = `${process.env.LINK_HOST}/verificar-email/${token}`;
        const from = {
            name: 'FLProductions',
            email: `${process.env.EMAIL_CRED_NORESP_USER}`,
        };
        const dataToEJS = { username: req.session.user.username, link };
        await sendAEmail(
            'user-verificar_correo',
            dataToEJS,
            from,
            email,
            'Verifique su correo'
        );

        res.send({ message: 'VERIFY_EMAIL_SEND' });
    } catch (error) {
        handleHttpError(res, 'PROBLEMA_AL_ENVIAR_EMAIL_DE_VERIFICACION');
    }
};
const emailVerifyCtrl = async (req, res) => {
    async function tempToken(token) {
        try {
            const result = await temp_token_poolModel.findOne({
                where: { token, type: 'role' },
            });
            return result;
        } catch (error) {
            handleHttpError(res, 'INVALID_TOKEN');
        }
    }
    try {
        const { token } = matchedData(req);
        const tempTokenData = await tempToken(token);
        const userData = await usuariosModel.findOne({
            where: { email: tempTokenData.user_email },
        });
        await tempTokenData.destroy();
        await role_usersModel.create({ user_id: userData.id, role_id: 1 });
        await avatar_usersModel.create({ user_id: userData.id, avatar: 8 });
        res.send({ message: 'EMAIL_VERIFIED', email: userData.email });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'Error_Verifying_Email');
    }
};

module.exports = {
    registerCtrl,
    loginCtrl,
    logoutCtrl,
    ckeckSessCtrl,
    sendPin,
    recoverPassword,
    updateUsersCtrl,
    verifyEmailCtrl,
    emailVerifyCtrl,
};
