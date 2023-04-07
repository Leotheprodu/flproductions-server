const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_CRED_NORESP_HOST, // Coloca el host correspondiente a tu servidor SMTP
    port: 465, // Puerto SMTP
    secure: true, // Si es necesario el uso de SSL o TLS
    auth: {
        user: process.env.EMAIL_CRED_NORESP_USER, // Coloca el correo desde el que enviarás los correos
        pass: process.env.EMAIL_CRED_NORESP_PASS// Coloca la contraseña del correo desde el que enviarás los correos
    }
});

module.exports = transporter;