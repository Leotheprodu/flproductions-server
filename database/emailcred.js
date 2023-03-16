const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'flproductionscr.com', // Coloca el host correspondiente a tu servidor SMTP
    port: 465, // Puerto SMTP
    secure: true, // Si es necesario el uso de SSL o TLS
    auth: {
        user: 'no-responder@flproductionscr.com', // Coloca el correo desde el que enviarás los correos
        pass: 'hT~kt1LIIMK}' // Coloca la contraseña del correo desde el que enviarás los correos
    }
});

module.exports = transporter;