const mongoose = require('mongoose');
const { pick } = require('lodash');

const instagramAccountSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pageId: {
      type: String,
      required: true,
      trim: true,
    },
    instagramBusinessId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pageAccessToken: {
      type: String,
      required: true,
      private: true,
    },
    username: {
      type: String,
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      trim: true,
    },
    followersCount: {
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

// Index for faster queries
instagramAccountSchema.index({ user: 1, instagramBusinessId: 1 });
// Note: instagramBusinessId already has unique index from schema definition (line 19)

// Check if Instagram Business ID is already connected
instagramAccountSchema.statics.isInstagramBusinessIdTaken = async function (instagramBusinessId, excludeAccountId) {
  const account = await this.findOne({ instagramBusinessId, _id: { $ne: excludeAccountId }, isActive: true });
  return !!account;
};

// Transform method to exclude sensitive data
instagramAccountSchema.methods.transform = function () {
  return pick(this.toJSON(), [
    'id',
    'user',
    'pageId',
    'instagramBusinessId',
    'username',
    'profilePictureUrl',
    'followersCount',
    'isActive',
    'createdAt',
    'updatedAt',
  ]);
};

const InstagramAccount = mongoose.model('InstagramAccount', instagramAccountSchema);

module.exports = InstagramAccount;

