const mongoose = require('mongoose');
const { pick } = require('lodash');

const messageSchema = mongoose.Schema(
  {
    conversation: {
      type: mongoose.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    instagramAccount: {
      type: mongoose.Types.ObjectId,
      ref: 'InstagramAccount',
      required: true,
    },
    messageId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    sender: {
      type: String,
      enum: ['user', 'page'],
      required: true,
    },
    senderId: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        type: {
          type: String,
          enum: ['image', 'video', 'audio', 'file'],
        },
        url: String,
      },
    ],
    timestamp: {
      type: Date,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

// Indexes for faster queries
messageSchema.index({ conversation: 1, timestamp: -1 });
messageSchema.index({ instagramAccount: 1, timestamp: -1 });
// Note: messageId already has unique index from schema definition (line 18)
messageSchema.index({ sender: 1, isRead: 1 });

// Transform method
messageSchema.methods.transform = function () {
  return pick(this.toJSON(), [
    'id',
    'conversation',
    'instagramAccount',
    'messageId',
    'sender',
    'senderId',
    'text',
    'attachments',
    'timestamp',
    'isRead',
    'createdAt',
    'updatedAt',
  ]);
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

