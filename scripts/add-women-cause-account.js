const mongoose = require('mongoose');
const axios = require('axios');
const config = require('../src/config/config');
const { User, InstagramAccount } = require('../src/models');

// Account details
const PAGE_ID = '819645794571678';
const INSTAGRAM_BUSINESS_ID = '17841474994620118';
const PAGE_ACCESS_TOKEN = 'EAAT4veIIFZAABQG1ZBV2nouln5X1T4uuUZCgkX08E6ygvZAR2nBrAdElzBaxRUmdE1T8NMuR5umddXZBO4Pdeasw1Po2UmigbjEkO1Qqj7vRE5HPx0SQt1y1Jy7W8RhQsVDyPZBr7gtWMd5bLSBM9Y6ZBa9qAqtiJROtcCJFA2uyiGzdpchYf1O70YKAAUmRz0lo2ZBZB49FF';
const USERNAME = 'Women_cause';

// User details for the new account
const USER_EMAIL = 'womencause@example.com';
const USER_PASSWORD = 'WomenCause123';
const USER_NAME = 'Women Cause User';

async function addWomenCauseAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to MongoDB\n');

    // Find or create user
    let user = await User.findOne({ email: USER_EMAIL });
    
    if (!user) {
      console.log(`📝 Creating new user: ${USER_EMAIL}`);
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(USER_PASSWORD, 8);
      
      user = await User.create({
        name: USER_NAME,
        email: USER_EMAIL,
        password: hashedPassword,
        role: 'user',
      });
      console.log(`✅ User created: ${user.email} (${user.id})\n`);
    } else {
      console.log(`📝 Using existing user: ${user.email} (${user.id})\n`);
    }

    // Fetch Instagram username from Meta API (optional, we already have it)
    console.log('🔍 Verifying Instagram account...');
    let fetchedUsername = USERNAME;
    
    try {
      const response = await axios.get(`https://graph.facebook.com/${config.meta.apiVersion}/${INSTAGRAM_BUSINESS_ID}`, {
        params: {
          fields: 'username,name',
          access_token: PAGE_ACCESS_TOKEN,
        },
      });
      
      if (response.data.username) {
        fetchedUsername = response.data.username;
        console.log(`✅ Verified username: ${fetchedUsername}\n`);
      } else {
        console.log(`⚠️  Could not fetch username from API, using provided: ${USERNAME}\n`);
      }
    } catch (error) {
      console.log(`⚠️  Could not verify username: ${error.message}`);
      console.log(`   Using provided username: ${USERNAME}\n`);
    }

    // Check if account already exists
    const existingAccount = await InstagramAccount.findOne({
      instagramBusinessId: INSTAGRAM_BUSINESS_ID,
    });

    if (existingAccount) {
      console.log('⚠️  Instagram account already exists. Updating...\n');
      existingAccount.pageId = PAGE_ID;
      existingAccount.pageAccessToken = PAGE_ACCESS_TOKEN;
      existingAccount.username = fetchedUsername;
      existingAccount.isActive = true;
      existingAccount.user = user.id;
      await existingAccount.save();

      console.log('✅ Instagram account updated successfully!');
      console.log(`   Account ID: ${existingAccount.id}`);
      console.log(`   Username: ${existingAccount.username}`);
      console.log(`   Business ID: ${existingAccount.instagramBusinessId}`);
      console.log(`   Page ID: ${existingAccount.pageId}`);
      console.log(`   User: ${user.email}`);
    } else {
      // Create new account
      const account = await InstagramAccount.create({
        user: user.id,
        pageId: PAGE_ID,
        instagramBusinessId: INSTAGRAM_BUSINESS_ID,
        pageAccessToken: PAGE_ACCESS_TOKEN,
        username: fetchedUsername,
        isActive: true,
      });

      console.log('✅ Instagram account created successfully!');
      console.log(`   Account ID: ${account.id}`);
      console.log(`   Username: ${account.username}`);
      console.log(`   Business ID: ${account.instagramBusinessId}`);
      console.log(`   Page ID: ${account.pageId}`);
      console.log(`   User: ${user.email}`);
    }

    // List all accounts for this user
    console.log('\n📋 All Instagram accounts for this user:');
    const allAccounts = await InstagramAccount.find({ user: user.id, isActive: true });
    allAccounts.forEach((acc, index) => {
      console.log(`   ${index + 1}. @${acc.username || acc.instagramBusinessId} (ID: ${acc.instagramBusinessId})`);
    });

    // Display login credentials
    console.log('\n🔑 Login Credentials:');
    console.log(`   Email: ${USER_EMAIL}`);
    console.log(`   Password: ${USER_PASSWORD}`);
    console.log('\n💡 You can now login with these credentials in a different window!');

    // Close connection
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate key error - account may already exist');
    }
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
addWomenCauseAccount();

