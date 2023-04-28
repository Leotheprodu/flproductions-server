const ejs = require('ejs');
const transporter = require('../config/nodemailer/transporter');

/**
 * el nombre del template que debe estar en configuracion, dataToEJS es la data que ocupa el template es un objeto, from es un objeto con el nombre quien envia y el correo, to es el correo del destinatario, y subjet es el asunto del correo.
 * @param {*} templateName
 * @param {*} dataToEJS
 * @param {*} from
 * @param {*} to
 * @param {*} subject
 */
const sendAEmail = async (templateName, dataToEJS, from, to, subject) => {
    await ejs.renderFile(
        __dirname + `/../config/nodemailer/templates/${templateName}.ejs`,
        dataToEJS,
        (error, data) => {
            if (error) {
                console.log(error);
            } else {
                const mailOptions = {
                    from: `${from.name} <${from.email}>`, // Coloca el correo desde el que enviarás los correos
                    to, // Coloca el correo del destinatario
                    subject,
                    html: data, // Contenido HTML generado a partir de la plantilla
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        const message = {
                            message: `Correo electrónico enviado: ${info.response}`,
                        };

                        return message;
                    }
                });
            }
        }
    );
};

module.exports = { sendAEmail };
