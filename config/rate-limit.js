const rateLimit = require('express-rate-limit');

const ratelimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutos
    max: 10, // Máximo 5 intentos de inicio de sesión en el periodo de tiempo especificado
    message:
        'Has excedido el límite de 10 intentos desde la misma ip. Inténtalo de nuevo en 5 minutos.',
});

module.exports = ratelimiter;
