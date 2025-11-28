const mongoose = require('mongoose');
const axios = require('axios');
const config = require('../src/config/config');
const { User, InstagramAccount } = require('../src/models');

// Account details
const PAGE_ID = '819645794571678';
const INSTAGRAM_BUSINESS_ID = '17841474994620118';
const PAGE_ACCESS_TOKEN = 'EAAT4veIIFZAABQG1ZBV2nouln5X1T4uuUZCgkX08E6ygvZAR2nBrAdElzBaxRUmdE1T8NMuR5umddXZBO4Pdeasw1Po2UmigbjEkO1Qqj7vRE5HPx0SQt1y1Jy7W8RhQsVDyPZBr7gtWMd5bLSBM9Y6ZBa9qAqtiJROtcCJFA2uyiGzdpchYf1O70YKAAUmRz0lo2ZBZB49FF';
const USER_EMAIL = 'test@test.com'; // Change if needed

async function addSecondAccount() {
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

    // Fetch Instagram username from Meta API
    console.log('🔍 Fetching Instagram username...');
    let username = `instagram_${INSTAGRAM_BUSINESS_ID.slice(-8)}`; // Fallback
    
    try {
      const response = await axios.get(`https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ID}`, {
        params: {
          fields: 'username,name',
          access_token: PAGE_ACCESS_TOKEN,
        },
      });
      
      if (response.data.username) {
        username = response.data.username;
        console.log(`✅ Found username: ${username}\n`);
      } else if (response.data.name) {
        username = response.data.name;
        console.log(`✅ Using name: ${username}\n`);
      } else {
        console.log(`⚠️  Could not fetch username, using fallback: ${username}\n`);
      }
    } catch (error) {
      console.log(`⚠️  Could not fetch username: ${error.message}`);
      console.log(`   Using fallback: ${username}\n`);
    }

    // Check if account already exists
    const existingAccount = await InstagramAccount.findOne({
      instagramBusinessId: INSTAGRAM_BUSINESS_ID,
    });

    if (existingAccount) {
      console.log('⚠️  Instagram account already exists. Updating...\n');
      existingAccount.pageId = PAGE_ID;
      existingAccount.pageAccessToken = PAGE_ACCESS_TOKEN;
      existingAccount.username = username;
      existingAccount.isActive = true;
      existingAccount.user = user.id;
      await existingAccount.save();

      console.log('✅ Instagram account updated successfully!');
      console.log(`   Account ID: ${existingAccount.id}`);
      console.log(`   Username: ${existingAccount.username}`);
      console.log(`   Business ID: ${existingAccount.instagramBusinessId}`);
      console.log(`   Page ID: ${existingAccount.pageId}`);
    } else {
      // Create new account
      const account = await InstagramAccount.create({
        user: user.id,
        pageId: PAGE_ID,
        instagramBusinessId: INSTAGRAM_BUSINESS_ID,
        pageAccessToken: PAGE_ACCESS_TOKEN,
        username: username,
        isActive: true,
      });

      console.log('✅ Instagram account created successfully!');
      console.log(`   Account ID: ${account.id}`);
      console.log(`   Username: ${account.username}`);
      console.log(`   Business ID: ${account.instagramBusinessId}`);
      console.log(`   Page ID: ${account.pageId}`);
    }

    // List all accounts for this user
    console.log('\n📋 All Instagram accounts for this user:');
    const allAccounts = await InstagramAccount.find({ user: user.id, isActive: true });
    allAccounts.forEach((acc, index) => {
      console.log(`   ${index + 1}. ${acc.username || acc.instagramBusinessId} (ID: ${acc.instagramBusinessId})`);
    });

    // Close connection
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
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
addSecondAccount();

