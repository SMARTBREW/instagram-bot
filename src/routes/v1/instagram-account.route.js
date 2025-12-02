const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const instagramAccountValidation = require('../../validations/instagram-account.validation');
const instagramAccountController = require('../../controllers/instagram-account.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manage-instagram-accounts'),
    validate(instagramAccountValidation.connectAccount),
    instagramAccountController.connectAccount
  )
  .get(
    auth('manage-instagram-accounts'),
    validate(instagramAccountValidation.getAccounts),
    instagramAccountController.getAccounts
  );

router
  .route('/:accountId')
  .get(
    auth('manage-instagram-accounts'),
    validate(instagramAccountValidation.getAccount),
    instagramAccountController.getAccount
  )
  .patch(
    auth('manage-instagram-accounts'),
    validate(instagramAccountValidation.updateAccount),
    instagramAccountController.updateAccount
  )
  .delete(
    auth('manage-instagram-accounts'),
    validate(instagramAccountValidation.deleteAccount),
    instagramAccountController.deleteAccount
  );

router
  .route('/:accountId/profile')
  .get(
    auth('manage-instagram-accounts'),
    validate(instagramAccountValidation.getAccount),
    instagramAccountController.getAccountProfile
  );

module.exports = router;

