const mongoose = require('mongoose');
const config = require('../src/config/config');
const { InstagramAccount } = require('../src/models');

async function checkAccount() {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to MongoDB\n');

    const account = await InstagramAccount.findOne({ 
      instagramBusinessId: '17841476187112489' 
    });

    if (!account) {
      console.error('❌ Account not found');
      process.exit(1);
    }

    console.log('📋 Account Details:');
    console.log(`   ID: ${account.id}`);
    console.log(`   Page ID: ${account.pageId}`);
    console.log(`   Instagram Business ID: ${account.instagramBusinessId}`);
    console.log(`   Username: ${account.username}`);
    console.log(`   Has Page Access Token: ${account.pageAccessToken ? 'Yes' : 'No'}`);
    console.log(`   Is Active: ${account.isActive}\n`);

    // Check if pageId is correct (should be 883635578157178, not the business ID)
    if (account.pageId === account.instagramBusinessId) {
      console.log('⚠️  WARNING: Page ID is set to Instagram Business ID!');
      console.log('   This might cause issues. Updating to correct Page ID...\n');
      
      account.pageId = '883635578157178'; // The actual Page ID from earlier test
      await account.save();
      
      console.log('✅ Updated Page ID to: 883635578157178');
    } else {
      console.log('✅ Page ID looks correct');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkAccount();

