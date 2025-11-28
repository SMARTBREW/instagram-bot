const mongoose = require('mongoose');
const config = require('../src/config/config');
const { User, InstagramAccount } = require('../src/models');

const INSTAGRAM_BUSINESS_ID = '17841476187112489';
const NEW_USER_EMAIL = 'test@test.com'; // The user we just created

async function updateAccountUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to MongoDB');

    // Find the new user
    const user = await User.findOne({ email: NEW_USER_EMAIL });
    
    if (!user) {
      console.error(`❌ User with email ${NEW_USER_EMAIL} not found.`);
      process.exit(1);
    }

    console.log(`📝 Found user: ${user.email} (${user.id})`);

    // Find the Instagram account
    const account = await InstagramAccount.findOne({ 
      instagramBusinessId: INSTAGRAM_BUSINESS_ID 
    });

    if (!account) {
      console.error(`❌ Instagram account with Business ID ${INSTAGRAM_BUSINESS_ID} not found.`);
      process.exit(1);
    }

    // Update the account to be associated with the new user
    account.user = user.id;
    await account.save();

    console.log('✅ Instagram account updated successfully!');
    console.log(`   Account ID: ${account.id}`);
    console.log(`   Now associated with user: ${user.email}`);
    console.log(`   Business ID: ${account.instagramBusinessId}`);

    // Close connection
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
updateAccountUser();

