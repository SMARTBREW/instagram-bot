const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { Conversation, InstagramAccount } = require('../models');

// Helper functions moved from services
const getConversationsByAccount = async (instagramAccountId, options = {}) => {
  const limit = options.limit || 20;
  const skip = options.skip || 0;

  const conversations = await Conversation.find({ instagramAccount: instagramAccountId, isActive: true })
    .sort({ lastMessageTimestamp: -1 })
    .limit(limit)
    .skip(skip);

  return conversations;
};

const getConversationById = async (conversationId) => {
  return Conversation.findById(conversationId);
};

const deleteConversationById = async (conversationId) => {
  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  conversation.isActive = false;
  await conversation.save();
  return conversation;
};

const getInstagramAccountById = async (accountId) => {
  return InstagramAccount.findById(accountId);
};

const getConversationByIgUserId = async (instagramAccountId, igUserId) => {
  return Conversation.findOne({ instagramAccount: instagramAccountId, igUserId, isActive: true });
};

const getConversations = catchAsync(async (req, res) => {
  const { accountId } = req.params;

  const account = await getInstagramAccountById(accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instagram account not found');
  }
  if (account.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  const conversations = await getConversationsByAccount(accountId, req.query);
  const transformedConversations = conversations.map((conv) => conv.transform());
  res.send(transformedConversations);
});

const getConversation = catchAsync(async (req, res) => {
  const conversation = await getConversationById(req.params.conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  const account = await getInstagramAccountById(conversation.instagramAccount);
  if (!account || account.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.send(conversation.transform());
});

const deleteConversation = catchAsync(async (req, res) => {
  const conversation = await getConversationById(req.params.conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  const account = await getInstagramAccountById(conversation.instagramAccount);
  if (!account || account.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  await deleteConversationById(req.params.conversationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getConversations,
  getConversation,
  deleteConversation,
};

