const models = {
    artistasModel: require('./mysql/artistas'),
    storageModel: require('./mysql/storage'),
    usuariosModel: require('./mysql/usuarios'),
    temp_token_poolModel: require('./mysql/temp_token_pool'),

}

module.exports = models;