const mongoose = require('mongoose');
const config = require('../src/config/config');
const { User, InstagramAccount } = require('../src/models');

const INSTAGRAM_BUSINESS_ID = '17841476187112489';
const PAGE_ACCESS_TOKEN = 'EAAT4veIIFZAABQJcGIxZCtL5Cz6qUMAlnitdxN5v45BoNAohfSZCBFqYZCgvsWRzcbDx3xEYYSHp6ZB069KLCYke4VzCgSQPzcR6NOXwSEu5O7qvZBy214hYhYtb7S3t43LZCplkQocPpsGqQQOwOCRg0lSv5ZBO0IkdQBgfmggRhjRXHqs3tLq1MYUzpC6KxdnfZAVk1w6Ow';
const USERNAME = 'beher_hope';

async function addInstagramAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to MongoDB');

    // Find the first user (or you can modify this to find a specific user)
    const user = await User.findOne();
    
    if (!user) {
      console.error('❌ No user found in database. Please create a user first.');
      process.exit(1);
    }

    console.log(`📝 Using user: ${user.email} (${user.id})`);

    // Check if account already exists
    const existingAccount = await InstagramAccount.findOne({ 
      instagramBusinessId: INSTAGRAM_BUSINESS_ID 
    });

    if (existingAccount) {
      console.log('⚠️  Instagram account already exists. Updating...');
      existingAccount.pageAccessToken = PAGE_ACCESS_TOKEN;
      existingAccount.username = USERNAME;
      existingAccount.isActive = true;
      // If pageId is not set, use instagramBusinessId as fallback
      if (!existingAccount.pageId) {
        existingAccount.pageId = INSTAGRAM_BUSINESS_ID;
      }
      await existingAccount.save();
      console.log('✅ Instagram account updated successfully!');
      console.log(`   Account ID: ${existingAccount.id}`);
      console.log(`   Username: ${existingAccount.username}`);
      console.log(`   Business ID: ${existingAccount.instagramBusinessId}`);
    } else {
      // Create new account
      // Note: pageId is required, using instagramBusinessId as pageId
      // You may need to update this with the actual pageId if you have it
      const account = await InstagramAccount.create({
        user: user.id,
        pageId: INSTAGRAM_BUSINESS_ID, // Using business ID as pageId (update if you have actual pageId)
        instagramBusinessId: INSTAGRAM_BUSINESS_ID,
        pageAccessToken: PAGE_ACCESS_TOKEN,
        username: USERNAME,
        isActive: true,
      });

      console.log('✅ Instagram account created successfully!');
      console.log(`   Account ID: ${account.id}`);
      console.log(`   Username: ${account.username}`);
      console.log(`   Business ID: ${account.instagramBusinessId}`);
    }

    // Close connection
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate key error - account may already exist');
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
addInstagramAccount();

