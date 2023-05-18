const express = require('express');
const {
    songNameGeneratorCtrl,
    FLPChatRecordingStudioCtrl,
} = require('../controllers/chat-tools');
const {
    validatorSongIdeas,
    validatorFaq,
} = require('../validators/chat-tools');
const { isLoggedInTrue } = require('../middleware/isLoggedIn');
const { checkRoles } = require('../middleware/roles');

const router = express.Router();

router.post('/song-name-generator', validatorSongIdeas, songNameGeneratorCtrl);
router.post(
    '/flproductions-studio-faq',
    isLoggedInTrue,
    checkRoles([1]),
    validatorFaq,
    FLPChatRecordingStudioCtrl
);

module.exports = router;
