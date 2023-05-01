const express = require('express');
const { songNameGeneratorCtrl } = require('../controllers/chat-tools');
const { validatorSongIdeas } = require('../validators/chat-tools');

const router = express.Router();

router.post('/song-name-generator', validatorSongIdeas, songNameGeneratorCtrl);

module.exports = router;
