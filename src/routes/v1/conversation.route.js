const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const conversationValidation = require('../../validations/conversation.validation');
const conversationController = require('../../controllers/conversation.controller');

const router = express.Router();

router
  .route('/:accountId')
  .get(
    auth('view-conversations'),
    validate(conversationValidation.getConversations),
    conversationController.getConversations
  );

router
  .route('/detail/:conversationId')
  .get(auth('view-conversations'), validate(conversationValidation.getConversation), conversationController.getConversation)
  .delete(
    auth('view-conversations'),
    validate(conversationValidation.deleteConversation),
    conversationController.deleteConversation
  );

module.exports = router;

