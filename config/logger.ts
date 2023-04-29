const { IncomingWebhook } = require('@slack/webhook');
const fs = require('fs');
const path = require('path');
const webHook = new IncomingWebhook(process.env.SLACK_WEBHOOK);

const loggerstream = {
    write: (message: string) => {
        webHook.send({
            text: message,
        });
    },
};

const log = fs.createWriteStream(
    path.join(__dirname, '/../logs', 'express.log'),
    { flags: 'a' }
);

module.exports = { loggerstream, log };
