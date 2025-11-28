const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const connectAccount = {
  body: Joi.object().keys({
    pageId: Joi.string().required(),
    instagramBusinessId: Joi.string().required(),
    pageAccessToken: Joi.string().required(),
    username: Joi.string(),
    profilePictureUrl: Joi.string(),
    followersCount: Joi.number().integer().min(0),
  }),
};

const getAccounts = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAccount = {
  params: Joi.object().keys({
    accountId: Joi.string().custom(objectId),
  }),
};

const updateAccount = {
  params: Joi.object().keys({
    accountId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      pageAccessToken: Joi.string(),
      username: Joi.string(),
      profilePictureUrl: Joi.string(),
      followersCount: Joi.number().integer().min(0),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const deleteAccount = {
  params: Joi.object().keys({
    accountId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  connectAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
};

