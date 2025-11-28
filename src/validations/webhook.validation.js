const Joi = require('@hapi/joi');

const verifyWebhook = {
  query: Joi.object().keys({
    'hub.mode': Joi.string().required(),
    'hub.verify_token': Joi.string().required(),
    'hub.challenge': Joi.string().required(),
  }),
};

// No validation needed for webhook POST as Meta sends the payload
const handleWebhook = {
  body: Joi.object().keys({
    object: Joi.string().required(),
    entry: Joi.array().required(),
  }),
};

module.exports = {
  verifyWebhook,
  handleWebhook,
};

