const mongoose = require('mongoose');
const config = require('../src/config/config');
const { User, InstagramAccount } = require('../src/models');

/**
 * Bulk Add Instagram Accounts Script
 * 
 * Usage:
 * 1. Update the ACCOUNTS array below with your account details
 * 2. Update USER_EMAIL to the user who should own these accounts
 * 3. Run: node scripts/bulk-add-accounts.js
 */

// Configuration
const USER_EMAIL = 'test@test.com'; // Change to your user's email

// Add your Instagram accounts here
const ACCOUNTS = [
  {
    pageId: '883635578157178',
    instagramBusinessId: '17841476187112489',
    pageAccessToken: 'EAAT4veIIFZAABQJcGIxZCtL5Cz6qUMAlnitdxN5v45BoNAohfSZCBFqYZCgvsWRzcbDx3xEYYSHp6ZB069KLCYke4VzCgSQPzcR6NOXwSEu5O7qvZBy214hYhYtb7S3t43LZCplkQocPpsGqQQOwOCRg0lSv5ZBO0IkdQBgfmggRhjRXHqs3tLq1MYUzpC6KxdnfZAVk1w6Ow',
    username: 'beher_hope',
    profilePictureUrl: '', // Optional
    followersCount: 0, // Optional
  },
  // Add more accounts here:
  // {
  //   pageId: '123456789012345',
  //   instagramBusinessId: '98765432109876',
  //   pageAccessToken: 'EAAT4veIIFZA...',
  //   username: 'account2',
  // },
];

async function bulkAddAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to MongoDB\n');

    // Find the user
    const user = await User.findOne({ email: USER_EMAIL });
    if (!user) {
      console.error(`❌ User with email ${USER_EMAIL} not found.`);
      console.error('   Please create the user first or update USER_EMAIL in the script.');
      process.exit(1);
    }

    console.log(`📝 Using user: ${user.email} (${user.id})\n`);
    console.log(`📋 Adding ${ACCOUNTS.length} Instagram account(s)...\n`);

    const results = {
      added: [],
      updated: [],
      skipped: [],
      errors: [],
    };

    // Process each account
    for (let i = 0; i < ACCOUNTS.length; i++) {
      const accountData = ACCOUNTS[i];
      const accountNum = i + 1;

      try {
        console.log(`[${accountNum}/${ACCOUNTS.length}] Processing: ${accountData.username || accountData.instagramBusinessId}`);

        // Validate required fields
        if (!accountData.pageId || !accountData.instagramBusinessId || !accountData.pageAccessToken) {
          throw new Error('Missing required fields: pageId, instagramBusinessId, or pageAccessToken');
        }

        // Check if account already exists
        const existingAccount = await InstagramAccount.findOne({
          instagramBusinessId: accountData.instagramBusinessId,
        });

        if (existingAccount) {
          // Update existing account
          existingAccount.pageId = accountData.pageId;
          existingAccount.pageAccessToken = accountData.pageAccessToken;
          existingAccount.username = accountData.username || existingAccount.username;
          existingAccount.profilePictureUrl = accountData.profilePictureUrl || existingAccount.profilePictureUrl;
          existingAccount.followersCount = accountData.followersCount || existingAccount.followersCount;
          existingAccount.isActive = true;
          existingAccount.user = user.id; // Update user association
          await existingAccount.save();

          results.updated.push({
            id: existingAccount.id,
            username: existingAccount.username,
            instagramBusinessId: existingAccount.instagramBusinessId,
          });

          console.log(`   ✅ Updated existing account: ${existingAccount.username || existingAccount.instagramBusinessId}`);
        } else {
          // Create new account
          const account = await InstagramAccount.create({
            user: user.id,
            pageId: accountData.pageId,
            instagramBusinessId: accountData.instagramBusinessId,
            pageAccessToken: accountData.pageAccessToken,
            username: accountData.username,
            profilePictureUrl: accountData.profilePictureUrl,
            followersCount: accountData.followersCount || 0,
            isActive: true,
          });

          results.added.push({
            id: account.id,
            username: account.username,
            instagramBusinessId: account.instagramBusinessId,
          });

          console.log(`   ✅ Created new account: ${account.username || account.instagramBusinessId}`);
        }
      } catch (error) {
        const errorInfo = {
          account: accountData.username || accountData.instagramBusinessId,
          error: error.message,
        };

        if (error.code === 11000) {
          errorInfo.error = 'Duplicate Instagram Business ID';
          results.skipped.push(errorInfo);
          console.log(`   ⚠️  Skipped (duplicate): ${errorInfo.account}`);
        } else {
          results.errors.push(errorInfo);
          console.log(`   ❌ Error: ${error.message}`);
        }
      }

      console.log(''); // Empty line for readability
    }

    // Print summary
    console.log('📊 Summary:');
    console.log(`   ✅ Added: ${results.added.length}`);
    console.log(`   🔄 Updated: ${results.updated.length}`);
    console.log(`   ⚠️  Skipped: ${results.skipped.length}`);
    console.log(`   ❌ Errors: ${results.errors.length}\n`);

    if (results.added.length > 0) {
      console.log('✅ Successfully added accounts:');
      results.added.forEach((acc) => {
        console.log(`   - ${acc.username || acc.instagramBusinessId} (ID: ${acc.id})`);
      });
      console.log('');
    }

    if (results.updated.length > 0) {
      console.log('🔄 Updated accounts:');
      results.updated.forEach((acc) => {
        console.log(`   - ${acc.username || acc.instagramBusinessId} (ID: ${acc.id})`);
      });
      console.log('');
    }

    if (results.errors.length > 0) {
      console.log('❌ Errors:');
      results.errors.forEach((err) => {
        console.log(`   - ${err.account}: ${err.error}`);
      });
      console.log('');
    }

    // Close connection
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
bulkAddAccounts();

