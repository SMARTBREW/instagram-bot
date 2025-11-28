const axios = require('axios');

const PAGE_ACCESS_TOKEN = 'EAAT4veIIFZAABQJcGIxZCtL5Cz6qUMAlnitdxN5v45BoNAohfSZCBFqYZCgvsWRzcbDx3xEYYSHp6ZB069KLCYke4VzCgSQPzcR6NOXwSEu5O7qvZBy214hYhYtb7S3t43LZCplkQocPpsGqQQOwOCRg0lSv5ZBO0IkdQBgfmggRhjRXHqs3tLq1MYUzpC6KxdnfZAVk1w6Ow';
const INSTAGRAM_BUSINESS_ID = '17841476187112489';

async function testToken() {
  try {
    console.log('🔍 Testing Page Access Token...\n');

    // Test 1: Check token info
    console.log('1️⃣ Checking token info...');
    const tokenInfo = await axios.get(`https://graph.facebook.com/v21.0/me`, {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
        fields: 'id,name',
      },
    });
    console.log('✅ Token is valid');
    console.log(`   Page ID: ${tokenInfo.data.id}`);
    console.log(`   Page Name: ${tokenInfo.data.name}\n`);

    // Test 2: Check token permissions
    console.log('2️⃣ Checking token permissions...');
    const debugToken = await axios.get(`https://graph.facebook.com/v21.0/debug_token`, {
      params: {
        input_token: PAGE_ACCESS_TOKEN,
        access_token: PAGE_ACCESS_TOKEN,
      },
    });
    
    const scopes = debugToken.data.data?.scopes || [];
    console.log(`   Scopes: ${scopes.join(', ')}\n`);
    
    if (!scopes.includes('instagram_manage_messages')) {
      console.log('⚠️  WARNING: Token does NOT have instagram_manage_messages permission!');
      console.log('   You need to regenerate the token with this permission.\n');
    } else {
      console.log('✅ Token has instagram_manage_messages permission\n');
    }

    // Test 3: Check Instagram Business Account
    console.log('3️⃣ Checking Instagram Business Account...');
    const igAccount = await axios.get(`https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ID}`, {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
        fields: 'id,username,name',
      },
    });
    console.log('✅ Instagram account found');
    console.log(`   ID: ${igAccount.data.id}`);
    console.log(`   Username: ${igAccount.data.username || 'N/A'}`);
    console.log(`   Name: ${igAccount.data.name || 'N/A'}\n`);

    // Test 4: Check app mode (if possible)
    console.log('4️⃣ Summary:');
    console.log('   ✅ Token is valid');
    console.log('   ✅ Can access Instagram Business Account');
    if (scopes.includes('instagram_manage_messages')) {
      console.log('   ✅ Has instagram_manage_messages permission');
      console.log('\n💡 If you still get error (#3), check:');
      console.log('   1. App is in LIVE mode (not Development)');
      console.log('   2. Permissions are approved in App Review');
      console.log('   3. App has been submitted for review');
    } else {
      console.log('   ❌ Missing instagram_manage_messages permission');
      console.log('\n💡 Action needed:');
      console.log('   1. Go to Graph API Explorer');
      console.log('   2. Select your Page');
      console.log('   3. Add instagram_manage_messages permission');
      console.log('   4. Generate new token');
      console.log('   5. Update token in database');
    }

  } catch (error) {
    console.error('❌ Error testing token:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

testToken();

