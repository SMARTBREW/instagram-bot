const mongoose = require('mongoose');
const config = require('../src/config/config');
const { User, InstagramAccount } = require('../src/models');

// Use the new user email
const USER_EMAIL = 'womencause2@example.com';

// Instagram account details
const PAGE_ID = '819645794571678';
const INSTAGRAM_BUSINESS_ID = '17841474994620118';
const PAGE_ACCESS_TOKEN = 'EAAT4veIIFZAABQG1ZBV2nouln5X1T4uuUZCgkX08E6ygvZAR2nBrAdElzBaxRUmdE1T8NMuR5umddXZBO4Pdeasw1Po2UmigbjEkO1Qqj7vRE5HPx0SQt1y1Jy7W8RhQsVDyPZBr7gtWMd5bLSBM9Y6ZBa9qAqtiJROtcCJFA2uyiGzdpchYf1O70YKAAUmRz0lo2ZBZB49FF';
const USERNAME = 'women_cause';

async function linkAccount() {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to MongoDB\n');

    // Find user (should exist from API registration)
    const user = await User.findOne({ email: USER_EMAIL });
    
    if (!user) {
      console.error(`❌ User ${USER_EMAIL} not found. Please register via API first.`);
      process.exit(1);
    }

    console.log(`📝 Found user: ${user.email} (${user.id})\n`);

    // Link Instagram account
    let account = await InstagramAccount.findOne({
      instagramBusinessId: INSTAGRAM_BUSINESS_ID,
    });

    if (account) {
      account.user = user.id;
      account.pageId = PAGE_ID;
      account.pageAccessToken = PAGE_ACCESS_TOKEN;
      account.username = USERNAME;
      account.isActive = true;
      await account.save();
      console.log('✅ Instagram account linked!');
    } else {
      account = await InstagramAccount.create({
        user: user.id,
        pageId: PAGE_ID,
        instagramBusinessId: INSTAGRAM_BUSINESS_ID,
        pageAccessToken: PAGE_ACCESS_TOKEN,
        username: USERNAME,
        isActive: true,
      });
      console.log('✅ Instagram account created!');
    }

    console.log(`   Account: @${account.username}\n`);
    console.log('🔑 Login Credentials:');
    console.log(`   Email: ${USER_EMAIL}`);
    console.log(`   Password: WomenCause123\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

linkAccount();

