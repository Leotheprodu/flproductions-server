

// Definimos un objeto para almacenar la última vez que se envió un correo electrónico
let lastEmailSent = {};

// Middleware para limitar la tasa de envío de correos electrónicos
const emailRateLimit = (req, res, next) => {
    const email = req.body.email || req.params.email;
    const now = Date.now();
    const timeSinceLastEmail = now - (lastEmailSent[email] || 0);

    if (timeSinceLastEmail < 60 * 1000) { // Si el tiempo transcurrido desde el último correo electrónico es menor a un minuto
        return res.status(429).json({ message: 'Demasiados correos electrónicos enviados en poco tiempo. Por favor, espere un momento antes de volver a intentarlo.' });
    }

    lastEmailSent[email] = now; // Almacenamos la hora actual como la última vez que se envió un correo electrónico
    next();
};

module.exports = emailRateLimit;