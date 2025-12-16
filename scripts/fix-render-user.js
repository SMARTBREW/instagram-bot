const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Get MongoDB URL from environment or use default
// IMPORTANT: Set RENDER_MONGODB_URL environment variable with Render's actual MongoDB connection string
// You can find it in: Render Dashboard → Your Service → Environment → MONGODB_URL
const MONGODB_URL = process.env.RENDER_MONGODB_URL || process.env.MONGODB_URL || 'mongodb+srv://giridharchennuru_db_user:NoSob2KDOLjMuV0g@cluster0.r07aihb.mongodb.net/instagram-dm-automation';

// User details
const USER_EMAIL = 'womencause@example.com';
const NEW_PASSWORD = 'WomenCause123';

// Instagram account details
const PAGE_ID = '819645794571678';
const INSTAGRAM_BUSINESS_ID = '17841474994620118';
const PAGE_ACCESS_TOKEN = 'EAAT4veIIFZAABQG1ZBV2nouln5X1T4uuUZCgkX08E6ygvZAR2nBrAdElzBaxRUmdE1T8NMuR5umddXZBO4Pdeasw1Po2UmigbjEkO1Qqj7vRE5HPx0SQt1y1Jy7W8RhQsVDyPZBr7gtWMd5bLSBM9Y6ZBa9qAqtiJROtcCJFA2uyiGzdpchYf1O70YKAAUmRz0lo2ZBZB49FF';
const USERNAME = 'women_cause';

async function fixRenderUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log(`   URL: ${MONGODB_URL.replace(/\/\/.*@/, '//***:***@')}\n`);
    
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB\n');

    // Import models
    const { User, InstagramAccount } = require('../src/models');

    // Try to find user
    let user = await User.findOne({ email: USER_EMAIL });
    
    if (user) {
      console.log(`📝 Found existing user: ${user.email} (${user.id})`);
      
      // Delete the user to recreate with correct password
      console.log('🗑️  Deleting existing user to recreate...');
      await User.deleteOne({ _id: user.id });
      console.log('✅ User deleted\n');
    }

    // Create new user with correct password
    console.log('👤 Creating new user...');
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 8);
    user = await User.create({
      name: 'Women Cause User',
      email: USER_EMAIL,
      password: hashedPassword,
      role: 'user',
    });
    console.log(`✅ User created: ${user.email} (${user.id})\n`);

    // Create or update Instagram account
    console.log('📱 Setting up Instagram account...');
    let account = await InstagramAccount.findOne({
      instagramBusinessId: INSTAGRAM_BUSINESS_ID,
    });

    if (account) {
      console.log('   Updating existing Instagram account...');
      account.user = user.id;
      account.pageId = PAGE_ID;
      account.pageAccessToken = PAGE_ACCESS_TOKEN;
      account.username = USERNAME;
      account.isActive = true;
      await account.save();
      console.log('✅ Instagram account updated!');
    } else {
      console.log('   Creating new Instagram account...');
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

    console.log(`   Account: @${account.username}`);
    console.log(`   Business ID: ${account.instagramBusinessId}`);
    console.log(`   Page ID: ${account.pageId}\n`);

    // Verify
    const accounts = await InstagramAccount.find({ user: user.id, isActive: true });
    console.log('📋 Verification:');
    console.log(`   User: ${user.email}`);
    console.log(`   Linked accounts: ${accounts.length}`);
    accounts.forEach((acc, index) => {
      console.log(`     ${index + 1}. @${acc.username || acc.instagramBusinessId}`);
    });

    console.log('\n🔑 Login Credentials:');
    console.log(`   Email: ${USER_EMAIL}`);
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log('\n✅ Ready to login!');

    await mongoose.disconnect();
    console.log('\n✅ Done');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate key - trying to delete and recreate...');
    }
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixRenderUser();

