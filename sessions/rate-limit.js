const rateLimit = require("express-rate-limit");

const ratelimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 3 intentos de inicio de sesión en el periodo de tiempo especificado
    message: "Has excedido el límite de intentos de inicio de sesión. Por favor, inténtalo de nuevo en 15 minutos."
});

module.exports = ratelimiter;