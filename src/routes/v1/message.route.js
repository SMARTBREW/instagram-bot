const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const messageValidation = require('../../validations/message.validation');
const sendMessageValidation = require('../../validations/send-message.validation');
const messageController = require('../../controllers/message.controller');

const router = express.Router();

router
  .route('/:conversationId')
  .get(auth('view-messages'), validate(messageValidation.getMessages), messageController.getMessages)
  .post(auth('send-messages'), validate(sendMessageValidation.sendMessage), messageController.sendMessage);

router
  .route('/:conversationId/read')
  .post(auth('view-messages'), validate(messageValidation.markAsRead), messageController.markAsRead);

module.exports = router;

