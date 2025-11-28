const express = require('express');
const authRoute = require('./auth.route');
const conversationRoute = require('./conversation.route');
const instagramAccountRoute = require('./instagram-account.route');
const messageRoute = require('./message.route');
const webhookRoute = require('./webhook.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/conversations', conversationRoute);
router.use('/instagram', instagramAccountRoute);
router.use('/messages', messageRoute);
router.use('/webhook', webhookRoute);

module.exports = router;

