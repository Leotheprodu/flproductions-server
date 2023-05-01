const fs = require('fs');
const path = require('path');
const models = {};
const PATH_MODELS = path.join(__dirname, 'mysql');

// Función que elimina la extensión del nombre de archivo
const removeExtension = (fileName) => {
    return fileName.split('.').shift();
};

// Lee los archivos de la carpeta y crea un modelo por cada uno
fs.readdirSync(PATH_MODELS).forEach((file) => {
    if (file.endsWith('.js')) {
        const name = removeExtension(file);
        models[`${name}Model`] = require(`./mysql/${file}`);
    }
});

module.exports = models;
