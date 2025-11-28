const express = require('express');
const validate = require('../../middlewares/validate');
const webhookValidation = require('../../validations/webhook.validation');
const webhookController = require('../../controllers/webhook.controller');

const router = express.Router();

// GET /webhook - Verify webhook (Meta verification)
// Note: Validation removed because Express doesn't parse query params with dots well
router.get('/', webhookController.verifyWebhook);

// POST /webhook - Handle webhook events (receive messages)
router.post('/', validate(webhookValidation.handleWebhook), webhookController.handleWebhook);

module.exports = router;

