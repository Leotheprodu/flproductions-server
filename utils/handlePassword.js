const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Constrasena sin encryptar
 * @param {*} passwordPlain 
 */

const encrypt = async (passwordPlain) => {
    
    const hash = await bcrypt.hash(passwordPlain, saltRounds)
    
    return hash;

    
};

/**
 * Pasar contrasena sin ecriptar y pasaron contrasena encriptada
 * @param {*} passwordPlain 
 * @param {*} hashPassword 
 */

const compare = async (passwordPlain, hashPassword) => {

    return await bcrypt.compare(passwordPlain, hashPassword);
};

module.exports = { encrypt, compare };