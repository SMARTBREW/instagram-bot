const mongoose = require('mongoose');
const { pick } = require('lodash');

const conversationSchema = mongoose.Schema(
  {
    instagramAccount: {
      type: mongoose.Types.ObjectId,
      ref: 'InstagramAccount',
      required: true,
    },
    igUserId: {
      type: String,
      required: true,
      trim: true,
    },
    igUsername: {
      type: String,
      trim: true,
    },
    lastMessage: {
      type: String,
      trim: true,
    },
    lastMessageTimestamp: {
      type: Date,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

// Indexes for faster queries
conversationSchema.index({ instagramAccount: 1, igUserId: 1 }, { unique: true });
conversationSchema.index({ instagramAccount: 1, lastMessageTimestamp: -1 });
conversationSchema.index({ igUserId: 1 });

// Find or create conversation
conversationSchema.statics.findOrCreate = async function (instagramAccountId, igUserId, igUsername) {
  let conversation = await this.findOne({ instagramAccount: instagramAccountId, igUserId });
  if (!conversation) {
    conversation = await this.create({
      instagramAccount: instagramAccountId,
      igUserId,
      igUsername,
    });
  }
  return conversation;
};

// Update last message
conversationSchema.methods.updateLastMessage = async function (messageText, timestamp) {
  this.lastMessage = messageText;
  this.lastMessageTimestamp = timestamp;
  await this.save();
};

// Transform method
conversationSchema.methods.transform = function () {
  return pick(this.toJSON(), [
    'id',
    'instagramAccount',
    'igUserId',
    'igUsername',
    'lastMessage',
    'lastMessageTimestamp',
    'unreadCount',
    'isActive',
    'createdAt',
    'updatedAt',
  ]);
};

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;

