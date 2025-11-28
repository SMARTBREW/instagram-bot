const httpStatus = require('http-status');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const logger = require('../config/logger');
const { Message, Conversation, InstagramAccount } = require('../models');


const getInstagramAccountByBusinessId = async (instagramBusinessId) => {
  return InstagramAccount.findOne({ instagramBusinessId, isActive: true });
};

const getInstagramUserProfile = async (igUserId, pageAccessToken) => {
  try {
    const url = `https://graph.facebook.com/${config.meta.apiVersion}/${igUserId}`;

    logger.info(`Calling Meta API: ${url}?fields=username&access_token=...`);

    const response = await axios.get(url, {
      params: {
        fields: 'username,name',
        access_token: pageAccessToken,
      },
    });

    logger.info(`Meta API response: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching Instagram user profile: ${error.message}`);
    if (error.response) {
      logger.error(`Status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw new ApiError(httpStatus.BAD_REQUEST, error.response?.data?.error?.message || 'Failed to fetch user profile');
  }
};

const getInstagramUserByUsername = async (instagramBusinessId, username, pageAccessToken) => {
  try {
    const url = `https://graph.facebook.com/${config.meta.apiVersion}/${instagramBusinessId}`;

    logger.info(`Calling business_discovery API for username: ${username}`);

    const response = await axios.get(url, {
      params: {
        fields: `business_discovery.username(${username}){username,name,biography,website,profile_picture_url}`,
        access_token: pageAccessToken,
      },
    });

    if (response.data.business_discovery) {
      logger.info(`✅ Found user via business_discovery: ${response.data.business_discovery.username}`);
      return {
        username: response.data.business_discovery.username,
        name: response.data.business_discovery.name || response.data.business_discovery.username,
        id: response.data.business_discovery.id,
      };
    }

    throw new Error('User not found via business_discovery');
  } catch (error) {
    logger.error(`Error fetching user via business_discovery: ${error.message}`);
    throw error;
  }
};

const getConversationParticipants = async (conversationId, instagramBusinessId, pageAccessToken) => {
  try {
    const url = `https://graph.facebook.com/${config.meta.apiVersion}/${conversationId}`;

    const response = await axios.get(url, {
      params: {
        fields: 'participants{username,id}',
        access_token: pageAccessToken,
      },
    });

    return response.data;
  } catch (error) {
    logger.error(`Error fetching conversation participants: ${error.message}`);
    throw error;
  }
};

const sendInstagramMessage = async (recipientId, message, pageAccessToken, instagramBusinessId) => {
  try {
    const url = `https://graph.facebook.com/${config.meta.apiVersion}/${instagramBusinessId}/messages`;

    const payload = {
      recipient: {
        id: recipientId,
      },
      message: {
        text: message,
      },
    };

    const response = await axios.post(url, payload, {
      params: {
        access_token: pageAccessToken,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    logger.info(`Message sent successfully to ${recipientId}`, { messageId: response.data.message_id });
    return response.data;
  } catch (error) {
    logger.error(`Error sending Instagram message: ${error.message}`, {
      recipientId,
      error: error.response?.data,
    });

    if (error.response) {
      const { status, data } = error.response;
      throw new ApiError(status, data.error?.message || 'Failed to send message');
    }

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send message');
  }
};

const sendInstagramAttachment = async (recipientId, attachment, pageAccessToken, instagramBusinessId) => {
  try {
    const url = `https://graph.facebook.com/${config.meta.apiVersion}/${instagramBusinessId}/messages`;

    const payload = {
      recipient: {
        id: recipientId,
      },
      message: {
        attachment: {
          type: attachment.type, // 'image', 'video', 'audio', 'file'
          payload: {
            url: attachment.url,
          },
        },
      },
    };

    const response = await axios.post(url, payload, {
      params: {
        access_token: pageAccessToken,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    logger.info(`Attachment sent successfully to ${recipientId}`, { messageId: response.data.message_id });
    return response.data;
  } catch (error) {
    logger.error(`Error sending Instagram attachment: ${error.message}`, {
      recipientId,
      error: error.response?.data,
    });

    if (error.response) {
      const { status, data } = error.response;
      throw new ApiError(status, data.error?.message || 'Failed to send attachment');
    }

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send attachment');
  }
};

const storeIncomingMessage = async (messageData) => {
  const { instagramAccountId, igUserId, igUsername, messageId, text, timestamp, attachments } = messageData;

  try {
    // Find or create conversation
    const conversation = await Conversation.findOrCreate(instagramAccountId, igUserId, igUsername);

    // Check if message already exists (prevent duplicates)
    if (messageId) {
      const existingMessage = await Message.findOne({ messageId });
      if (existingMessage) {
        logger.info(`Message ${messageId} already exists, skipping`);
        return existingMessage;
      }
    }

    // Create message
    const message = await Message.create({
      conversation: conversation.id,
      instagramAccount: instagramAccountId,
      messageId,
      sender: 'user',
      senderId: igUserId,
      text,
      attachments: attachments || [],
      timestamp: new Date(timestamp),
      isRead: false,
    });

    // Update conversation last message
    await conversation.updateLastMessage(text, new Date(timestamp));

    // Increment unread count
    conversation.unreadCount += 1;
    await conversation.save();

    logger.info(`Stored message from user ${igUserId} in conversation ${conversation.id}`);
    return message;
  } catch (error) {
    logger.error(`Error storing message: ${error.message}`);
    throw error;
  }
};

/**
 * Verify webhook (GET request from Meta)
 * Meta will send a GET request to verify the webhook URL
 */
const verifyWebhook = catchAsync(async (req, res) => {
  // Meta sends query params with dots: hub.mode, hub.verify_token, hub.challenge
  // We need to manually parse them from the URL
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  const params = url.searchParams;
  
  const mode = params.get('hub.mode');
  const token = params.get('hub.verify_token');
  const challenge = params.get('hub.challenge');

  logger.info(`Webhook verification - mode: ${mode}, token: ${token ? 'present' : 'missing'}, challenge: ${challenge ? 'present' : 'missing'}`);

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === config.meta.verifyToken) {
      // Respond with 200 OK and challenge token from the request
      logger.info('✅ Webhook verified successfully!');
      res.status(httpStatus.OK).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      logger.error(`❌ Webhook verification failed - token mismatch. Expected: ${config.meta.verifyToken}, Got: ${token}`);
      res.sendStatus(httpStatus.FORBIDDEN);
    }
  } else {
    logger.error(`❌ Webhook verification failed - missing params. Mode: ${mode}, Token: ${token}, Challenge: ${challenge}`);
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
});

/**
 * Handle webhook events (POST request from Meta)
 * Meta will send POST requests with message events
 */
const handleWebhook = catchAsync(async (req, res) => {
  const body = req.body;

  // Log the incoming webhook payload
  logger.info(`📥 Webhook event received: ${body.object}`);

  // Check if this is a page subscription
  if (body.object === 'instagram') {
    // Process each entry
    body.entry.forEach(async (entry) => {
      // Get the messaging events
      const messagingEvents = entry.messaging || [];

      messagingEvents.forEach(async (event) => {
        try {
          const senderId = event.sender.id;
          const recipientId = event.recipient.id;

          // Find the Instagram account by Instagram Business ID
          const instagramAccount = await getInstagramAccountByBusinessId(recipientId);

          if (!instagramAccount) {
            logger.error(`❌ Instagram account not found for IG Business ID: ${recipientId}`);
            logger.error(`💡 To fix this, connect your Instagram account using POST /v1/instagram-accounts with instagramBusinessId: "${recipientId}"`);
            return;
          }

          // Log which account received the message
          const accountName = instagramAccount.username || instagramAccount.instagramBusinessId;
          logger.info(`📬 Message received by account: @${accountName} (ID: ${recipientId})`);

          // Handle message event
          if (event.message) {
            // Fetch username from Meta Graph API
            let username = `user_${senderId.slice(-8)}`; // Fallback to last 8 digits
            
            try {
              logger.info(`Fetching username for ${senderId} using token: ${instagramAccount.pageAccessToken ? 'present' : 'missing'}`);
              const userProfile = await getInstagramUserProfile(senderId, instagramAccount.pageAccessToken);
              username = userProfile.username || userProfile.name || username;
              logger.info(`✅ Successfully fetched username: ${username}`);
            } catch (error) {
              logger.error(`⚠️ Could not fetch username for ${senderId}: ${error.message}`);
              logger.error(`Error details: ${JSON.stringify(error.response?.data || {})}`);
              // Will use fallback username
            }
            
            const messageData = {
              instagramAccountId: instagramAccount.id,
              igUserId: senderId,
              igUsername: username,
              messageId: event.message.mid,
              text: event.message.text || '',
              timestamp: event.timestamp,
              attachments: [],
            };

            // Handle attachments if present
            if (event.message.attachments) {
              messageData.attachments = event.message.attachments.map((attachment) => ({
                type: attachment.type,
                url: attachment.payload?.url || '',
              }));
            }

            // Store the message
            await storeIncomingMessage(messageData);
            
            // Log with account name, username and message preview
            const messagePreview = messageData.text ? messageData.text.substring(0, 50) : '[No text]';
            const attachmentInfo = messageData.attachments.length > 0 
              ? ` + ${messageData.attachments.length} attachment(s)` 
              : '';
            
            logger.info(`💬 Message to @${accountName} from @${username} (ID: ${senderId}): "${messagePreview}"${attachmentInfo}`);
          }

          // Handle message reactions (optional)
          if (event.reaction) {
            const username = event.sender.username || senderId;
            const emoji = event.reaction.emoji || event.reaction.reaction;
            logger.info(`❤️ Reaction from @${username}: ${emoji}`);
            // You can implement reaction handling here
          }

          // Handle message reads (optional)
          if (event.read) {
            const username = event.sender.username || senderId;
            logger.info(`👁️ @${username} read the message`);
            // You can implement read receipt handling here
          }
        } catch (error) {
          logger.error(`Error processing webhook event: ${error.message}`);
        }
      });
    });

    // Return a '200 OK' response to all events
    res.status(httpStatus.OK).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(httpStatus.NOT_FOUND);
  }
});

module.exports = {
  verifyWebhook,
  handleWebhook,
};

