const express = require('express');
const {
    songNameGeneratorCtrl,
    FLPChatRecordingStudioCtrl,
    ShowResponsesCtrl,
} = require('../controllers/chat-tools');
const rateLimiter = require('../config/rate-limit');
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
    rateLimiter,
    validatorFaq,
    FLPChatRecordingStudioCtrl
);
router.get('/responses', isLoggedInTrue, checkRoles([1]), ShowResponsesCtrl);

module.exports = router;
