const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// IMPORTANT: Replace this with your Render MongoDB connection string
// You can find it in Render Dashboard → Your Service → Environment → MONGODB_URL
// Or use the same connection string from your Render environment variables
const RENDER_MONGODB_URL = process.env.RENDER_MONGODB_URL || 'mongodb+srv://giridharchennuru_db_user:NoSob2KDOLjMuV0g@cluster0.r07aihb.mongodb.net/instagram-dm-automation';

// User details
const USER_EMAIL = 'womencause@example.com';
const NEW_PASSWORD = 'WomenCause123';

// Instagram account details
const PAGE_ID = '819645794571678';
const INSTAGRAM_BUSINESS_ID = '17841474994620118';
const PAGE_ACCESS_TOKEN = 'EAAT4veIIFZAABQG1ZBV2nouln5X1T4uuUZCgkX08E6ygvZAR2nBrAdElzBaxRUmdE1T8NMuR5umddXZBO4Pdeasw1Po2UmigbjEkO1Qqj7vRE5HPx0SQt1y1Jy7W8RhQsVDyPZBr7gtWMd5bLSBM9Y6ZBa9qAqtiJROtcCJFA2uyiGzdpchYf1O70YKAAUmRz0lo2ZBZB49FF';
const USERNAME = 'women_cause';

async function updateRenderUser() {
  try {
    // Connect to Render's MongoDB
    console.log('🔗 Connecting to Render MongoDB...');
    console.log(`   Using: ${RENDER_MONGODB_URL.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials
    
    await mongoose.connect(RENDER_MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to Render MongoDB\n');

    // Import models after connection
    const { User, InstagramAccount } = require('../src/models');

    // Find the user
    const user = await User.findOne({ email: USER_EMAIL });
    
    if (!user) {
      console.error(`❌ User with email ${USER_EMAIL} not found in Render database.`);
      console.error('   Creating new user...');
      
      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 8);
      const newUser = await User.create({
        name: 'Women Cause User',
        email: USER_EMAIL,
        password: hashedPassword,
        role: 'user',
      });
      console.log(`✅ User created: ${newUser.email} (${newUser.id})\n`);
      
      // Create Instagram account
      const account = await InstagramAccount.create({
        user: newUser.id,
        pageId: PAGE_ID,
        instagramBusinessId: INSTAGRAM_BUSINESS_ID,
        pageAccessToken: PAGE_ACCESS_TOKEN,
        username: USERNAME,
        isActive: true,
      });
      console.log('✅ Instagram account created and linked!');
      console.log(`   Account: @${account.username}`);
      
    } else {
      console.log(`📝 Found user: ${user.email} (${user.id})\n`);

      // Update password
      console.log('🔐 Updating password...');
      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 8);
      user.password = hashedPassword;
      await user.save();
      console.log('✅ Password updated successfully!\n');

      // Link Instagram account to this user
      console.log('🔗 Linking Instagram account...');
      const existingAccount = await InstagramAccount.findOne({
        instagramBusinessId: INSTAGRAM_BUSINESS_ID,
      });

      if (existingAccount) {
        console.log('   Instagram account found, updating user link...');
        existingAccount.user = user.id;
        existingAccount.pageId = PAGE_ID;
        existingAccount.pageAccessToken = PAGE_ACCESS_TOKEN;
        existingAccount.username = USERNAME;
        existingAccount.isActive = true;
        await existingAccount.save();
        console.log('✅ Instagram account linked successfully!');
        console.log(`   Account: @${existingAccount.username}`);
        console.log(`   Business ID: ${existingAccount.instagramBusinessId}`);
      } else {
        console.log('   Creating new Instagram account...');
        const account = await InstagramAccount.create({
          user: user.id,
          pageId: PAGE_ID,
          instagramBusinessId: INSTAGRAM_BUSINESS_ID,
          pageAccessToken: PAGE_ACCESS_TOKEN,
          username: USERNAME,
          isActive: true,
        });
        console.log('✅ Instagram account created and linked!');
        console.log(`   Account: @${account.username}`);
      }
    }

    // Verify
    const { User: UserModel, InstagramAccount: AccountModel } = require('../src/models');
    const finalUser = await UserModel.findOne({ email: USER_EMAIL });
    const accounts = await AccountModel.find({ user: finalUser.id, isActive: true });
    
    console.log('\n📋 Verification:');
    console.log(`   User: ${finalUser.email}`);
    console.log(`   Linked accounts: ${accounts.length}`);
    accounts.forEach((acc, index) => {
      console.log(`     ${index + 1}. @${acc.username || acc.instagramBusinessId}`);
    });

    console.log('\n🔑 Login Credentials:');
    console.log(`   Email: ${USER_EMAIL}`);
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log('\n✅ You can now login to Render with these credentials!');

    // Close connection
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
updateRenderUser();

