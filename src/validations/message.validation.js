const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const getMessages = {
  params: Joi.object().keys({
    conversationId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(100),
    skip: Joi.number().integer().min(0),
  }),
};

const markAsRead = {
  params: Joi.object().keys({
    conversationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getMessages,
  markAsRead,
};

