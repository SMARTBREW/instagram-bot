const httpStatus = require('http-status');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { InstagramAccount } = require('../models');
const config = require('../config/config');

// Helper functions moved from services
const connectInstagramAccount = async (accountBody) => {
  if (await InstagramAccount.isInstagramBusinessIdTaken(accountBody.instagramBusinessId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Instagram Business ID already connected');
  }
  return InstagramAccount.create(accountBody);
};

const getInstagramAccountsByUser = async (userId) => {
  return InstagramAccount.find({ user: userId, isActive: true });
};

const getInstagramAccountById = async (accountId) => {
  return InstagramAccount.findById(accountId);
};

const getInstagramAccountByBusinessId = async (instagramBusinessId) => {
  return InstagramAccount.findOne({ instagramBusinessId, isActive: true });
};

const updateInstagramAccountById = async (accountId, updateBody) => {
  const account = await getInstagramAccountById(accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instagram account not found');
  }
  if (updateBody.instagramBusinessId && (await InstagramAccount.isInstagramBusinessIdTaken(updateBody.instagramBusinessId, accountId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Instagram Business ID already connected');
  }
  Object.assign(account, updateBody);
  await account.save();
  return account;
};

const deleteInstagramAccountById = async (accountId) => {
  const account = await getInstagramAccountById(accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instagram account not found');
  }
  account.isActive = false;
  await account.save();
  return account;
};

const connectAccount = catchAsync(async (req, res) => {
  const accountBody = {
    ...req.body,
    user: req.user.id,
  };
  const account = await connectInstagramAccount(accountBody);
  res.status(httpStatus.CREATED).send(account.transform());
});

const getAccounts = catchAsync(async (req, res) => {
  const accounts = await getInstagramAccountsByUser(req.user.id);
  const transformedAccounts = accounts.map((account) => account.transform());
  res.send(transformedAccounts);
});

const getAccount = catchAsync(async (req, res) => {
  const account = await getInstagramAccountById(req.params.accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instagram account not found');
  }
  if (account.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  res.send(account.transform());
});

const updateAccount = catchAsync(async (req, res) => {
  const account = await getInstagramAccountById(req.params.accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instagram account not found');
  }
  if (account.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  const updatedAccount = await updateInstagramAccountById(req.params.accountId, req.body);
  res.send(updatedAccount.transform());
});

const deleteAccount = catchAsync(async (req, res) => {
  const account = await getInstagramAccountById(req.params.accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instagram account not found');
  }
  if (account.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  await deleteInstagramAccountById(req.params.accountId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAccountProfile = catchAsync(async (req, res) => {
  const account = await getInstagramAccountById(req.params.accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instagram account not found');
  }
  if (account.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  // Fetch profile details using business_discovery API (requires instagram_basic)
  try {
    const url = `https://graph.facebook.com/${config.meta.apiVersion}/${account.instagramBusinessId}`;
    const response = await axios.get(url, {
      params: {
        fields: `business_discovery.username(${account.username || 'self'}){username,name,biography,website,profile_picture_url,followers_count,media_count,media{id,media_type,media_url,permalink,timestamp,caption}}`,
        access_token: account.pageAccessToken,
      },
    });

    if (response.data.business_discovery) {
      const profile = response.data.business_discovery;
      res.send({
        username: profile.username,
        name: profile.name,
        biography: profile.biography || '',
        website: profile.website || '',
        profilePictureUrl: profile.profile_picture_url,
        followersCount: profile.followers_count || 0,
        mediaCount: profile.media_count || 0,
        media: (profile.media?.data || []).slice(0, 12), // Show first 12 posts
        instagramBusinessId: account.instagramBusinessId,
      });
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
    }
  } catch (error) {
    if (error.response) {
      throw new ApiError(error.response.status, error.response.data?.error?.message || 'Failed to fetch profile');
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch profile');
  }
});

module.exports = {
  connectAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  getAccountProfile,
};

