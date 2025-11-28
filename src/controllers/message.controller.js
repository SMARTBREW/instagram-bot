const httpStatus = require('http-status');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const config = require('../config/config');
const { Message, Conversation, InstagramAccount } = require('../models');

// Helper functions moved from services
const getConversationById = async (conversationId) => {
  return Conversation.findById(conversationId);
};

const getInstagramAccountById = async (accountId) => {
  return InstagramAccount.findById(accountId);
};

const getMessagesByConversation = async (conversationId, options = {}) => {
  const limit = options.limit || 50;
  const skip = options.skip || 0;

  const messages = await Message.find({ conversation: conversationId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);

  return messages;
};

const markMessagesAsRead = async (conversationId) => {
  await Message.updateMany({ conversation: conversationId, sender: 'user', isRead: false }, { isRead: true });

  const conversation = await Conversation.findById(conversationId);
  if (conversation) {
    conversation.unreadCount = 0;
    await conversation.save();
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

const storeOutgoingMessage = async (messageData) => {
  const { conversationId, instagramAccountId, messageId, text, timestamp, attachments } = messageData;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      instagramAccount: instagramAccountId,
      messageId,
      sender: 'page',
      senderId: instagramAccountId,
      text,
      attachments: attachments || [],
      timestamp: timestamp || new Date(),
      isRead: true,
    });

    // Update conversation last message
    await conversation.updateLastMessage(text, timestamp || new Date());

    logger.info(`Stored outgoing message to conversation ${conversationId}`);
    return message;
  } catch (error) {
    logger.error(`Error storing outgoing message: ${error.message}`);
    throw error;
  }
};

const sendInstagramMessage = async (recipientId, message, pageAccessToken, instagramBusinessId, pageId) => {
  try {
    // Use Page ID if available, otherwise fall back to Instagram Business ID
    const accountId = pageId || instagramBusinessId;
    const url = `https://graph.facebook.com/${config.meta.apiVersion}/${accountId}/messages`;

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
      const errorMessage = data.error?.message || 'Failed to send message';
      const errorCode = data.error?.code;
      const errorType = data.error?.type;
      const errorSubcode = data.error?.error_subcode;
      
      // Log detailed error information
      logger.error(`Meta API Error Details:`, {
        code: errorCode,
        type: errorType,
        subcode: errorSubcode,
        message: errorMessage,
        fullError: JSON.stringify(data.error, null, 2),
      });
      
      // Provide helpful guidance for common errors
      if (errorCode === 3 || errorMessage.includes('capability')) {
        logger.error(`💡 Error #3: Application does not have the capability`);
        logger.error(`   This usually means app configuration issue or missing Advanced Access`);
      } else if (errorCode === 200 && errorSubcode === 2534048) {
        logger.error(`💡 Error #200 (Subcode 2534048): Advanced Access Required`);
        logger.error(`   Message: "${errorMessage}"`);
        logger.error(`   Solutions:`);
        logger.error(`   1. Request Advanced Access for instagram_manage_messages`);
        logger.error(`   2. OR ensure recipient messaged you within 24 hours (for Standard Access)`);
        logger.error(`   3. Go to: App Review → Permissions → instagram_manage_messages → Request Advanced Access`);
      }
      
      throw new ApiError(status, errorMessage);
    }

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send message');
  }
};

const sendInstagramAttachment = async (recipientId, attachment, pageAccessToken, instagramBusinessId, pageId) => {
  try {
    // Use Page ID if available, otherwise fall back to Instagram Business ID
    const accountId = pageId || instagramBusinessId;
    const url = `https://graph.facebook.com/${config.meta.apiVersion}/${accountId}/messages`;

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

const sendMessageToInstagram = async (conversationId, text, instagramAccount) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }

    // Send message via Meta API
    const response = await sendInstagramMessage(
      conversation.igUserId,
      text,
      instagramAccount.pageAccessToken,
      instagramAccount.instagramBusinessId,
      instagramAccount.pageId
    );

    // Store the sent message
    const messageData = {
      conversationId,
      instagramAccountId: instagramAccount.id,
      messageId: response.message_id,
      text,
      timestamp: new Date(),
    };

    const message = await storeOutgoingMessage(messageData);
    logger.info(`Message sent and stored for conversation ${conversationId}`);

    return message;
  } catch (error) {
    logger.error(`Error sending message: ${error.message}`);
    throw error;
  }
};

const sendAttachmentToInstagram = async (conversationId, attachment, instagramAccount) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }

    // Send attachment via Meta API
    const response = await sendInstagramAttachment(
      conversation.igUserId,
      attachment,
      instagramAccount.pageAccessToken,
      instagramAccount.instagramBusinessId,
      instagramAccount.pageId
    );

    // Store the sent message
    const messageData = {
      conversationId,
      instagramAccountId: instagramAccount.id,
      messageId: response.message_id,
      text: '',
      attachments: [attachment],
      timestamp: new Date(),
    };

    const message = await storeOutgoingMessage(messageData);
    logger.info(`Attachment sent and stored for conversation ${conversationId}`);

    return message;
  } catch (error) {
    logger.error(`Error sending attachment: ${error.message}`);
    throw error;
  }
};

const getMessages = catchAsync(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  // Verify conversation belongs to user's account
  const account = await getInstagramAccountById(conversation.instagramAccount);
  if (!account || account.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  const messages = await getMessagesByConversation(conversationId, req.query);
  const transformedMessages = messages.map((msg) => msg.transform());
  res.send(transformedMessages);
});

const markAsRead = catchAsync(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  // Verify conversation belongs to user's account
  const account = await getInstagramAccountById(conversation.instagramAccount);
  if (!account || account.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  await markMessagesAsRead(conversationId);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendMessage = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const { text, attachment } = req.body;

  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  // Verify conversation belongs to user's account
  const account = await getInstagramAccountById(conversation.instagramAccount);
  if (!account || account.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  let message;
  if (attachment) {
    // Send attachment
    message = await sendAttachmentToInstagram(conversationId, attachment, account);
  } else if (text) {
    // Send text message
    message = await sendMessageToInstagram(conversationId, text, account);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Either text or attachment is required');
  }

  res.status(httpStatus.CREATED).send(message.transform());
});

module.exports = {
  getMessages,
  markAsRead,
  sendMessage,
};

