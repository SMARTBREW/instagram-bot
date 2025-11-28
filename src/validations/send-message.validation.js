const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const sendMessage = {
  params: Joi.object().keys({
    conversationId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      text: Joi.string().trim(),
      attachment: Joi.object().keys({
        type: Joi.string().valid('image', 'video', 'audio', 'file').required(),
        url: Joi.string().uri().required(),
      }),
    })
    .or('text', 'attachment')
    .messages({
      'object.missing': 'Either text or attachment is required',
    }),
};

module.exports = {
  sendMessage,
};

