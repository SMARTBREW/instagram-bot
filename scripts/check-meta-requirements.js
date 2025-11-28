const axios = require('axios');

const PAGE_ACCESS_TOKEN = 'EAAT4veIIFZAABQJcGIxZCtL5Cz6qUMAlnitdxN5v45BoNAohfSZCBFqYZCgvsWRzcbDx3xEYYSHp6ZB069KLCYke4VzCgSQPzcR6NOXwSEu5O7qvZBy214hYhYtb7S3t43LZCplkQocPpsGqQQOwOCRg0lSv5ZBO0IkdQBgfmggRhjRXHqs3tLq1MYUzpC6KxdnfZAVk1w6Ow';
const PAGE_ID = '883635578157178';
const RECIPIENT_ID = '1416318236725299';

async function checkRequirements() {
  try {
    console.log('🔍 Checking Meta API requirements...\n');

    // Check 1: Verify the recipient can be accessed
    console.log('1️⃣ Checking if we can access recipient info...');
    try {
      const recipientInfo = await axios.get(`https://graph.facebook.com/v21.0/${RECIPIENT_ID}`, {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: 'id,name',
        },
      });
      console.log('✅ Can access recipient');
      console.log(`   ID: ${recipientInfo.data.id}`);
      console.log(`   Name: ${recipientInfo.data.name || 'N/A'}\n`);
    } catch (error) {
      console.log('❌ Cannot access recipient directly');
      console.log(`   This is normal - Instagram user IDs are private\n`);
    }

    // Check 2: Try to get conversation info
    console.log('2️⃣ Checking conversation capabilities...');
    try {
      // Try to get page conversations
      const conversations = await axios.get(`https://graph.facebook.com/v21.0/${PAGE_ID}/conversations`, {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: 'id,participants',
          limit: 1,
        },
      });
      console.log('✅ Can access conversations');
      console.log(`   Found ${conversations.data.data?.length || 0} conversations\n`);
    } catch (error) {
      console.log('⚠️  Cannot access conversations directly');
      console.log(`   Error: ${error.response?.data?.error?.message || error.message}\n`);
    }

    // Check 3: Check app permissions status
    console.log('3️⃣ Summary and Recommendations:\n');
    console.log('Based on error #200 (Subcode 2534048):');
    console.log('   "App does not have Advanced Access and recipient does not have role on app"\n');
    console.log('💡 Solutions:\n');
    console.log('   Option 1: Request Advanced Access (Recommended)');
    console.log('   - Go to: Meta Developer Console → App Review → Permissions');
    console.log('   - Find: instagram_manage_messages');
    console.log('   - Click: "Request Advanced Access"');
    console.log('   - Submit use case and wait for approval\n');
    
    console.log('   Option 2: Add Recipient as Test User (Development Mode Only)');
    console.log('   - Go to: Meta Developer Console → Roles → Test Users');
    console.log('   - Add the recipient as a test user');
    console.log('   - Note: This only works in Development mode\n');
    
    console.log('   Option 3: Check App Mode');
    console.log('   - Ensure app is in Live mode for production use');
    console.log('   - Development mode has limitations\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }
}

checkRequirements();

