const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const getConversations = {
  params: Joi.object().keys({
    accountId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(100),
    skip: Joi.number().integer().min(0),
  }),
};

const getConversation = {
  params: Joi.object().keys({
    conversationId: Joi.string().custom(objectId),
  }),
};

const deleteConversation = {
  params: Joi.object().keys({
    conversationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getConversations,
  getConversation,
  deleteConversation,
};

