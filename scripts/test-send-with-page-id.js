const axios = require('axios');

// Configuration
const PAGE_ACCESS_TOKEN = 'EAAT4veIIFZAABQJcGIxZCtL5Cz6qUMAlnitdxN5v45BoNAohfSZCBFqYZCgvsWRzcbDx3xEYYSHp6ZB069KLCYke4VzCgSQPzcR6NOXwSEu5O7qvZBy214hYhYtb7S3t43LZCplkQocPpsGqQQOwOCRg0lSv5ZBO0IkdQBgfmggRhjRXHqs3tLq1MYUzpC6KxdnfZAVk1w6Ow';
const PAGE_ID = '883635578157178'; // From earlier test
const INSTAGRAM_BUSINESS_ID = '17841476187112489';
const RECIPIENT_ID = '1416318236725299'; // The user who sent "okay" message
const MESSAGE_TEXT = 'Hello! Testing with Page ID instead of Instagram Business ID.';

async function testWithPageId() {
  try {
    console.log('📤 Testing with Page ID instead of Instagram Business ID...\n');
    console.log(`   Page ID: ${PAGE_ID}`);
    console.log(`   Recipient ID: ${RECIPIENT_ID}`);
    console.log(`   Message: "${MESSAGE_TEXT}"\n`);

    // Try using Page ID
    const url = `https://graph.facebook.com/v21.0/${PAGE_ID}/messages`;

    const payload = {
      recipient: {
        id: RECIPIENT_ID,
      },
      message: {
        text: MESSAGE_TEXT,
      },
    };

    console.log('📋 Request Details:');
    console.log(`   URL: ${url}`);
    console.log(`   Method: POST`);
    console.log(`   Payload: ${JSON.stringify(payload, null, 2)}\n`);

    const response = await axios.post(url, payload, {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ SUCCESS! Message sent using Page ID!');
    console.log(`   Message ID: ${response.data.message_id}`);
    console.log(`   Full Response: ${JSON.stringify(response.data, null, 2)}`);
    console.log('\n💡 Solution: Use Page ID instead of Instagram Business ID in the endpoint!');

  } catch (error) {
    console.error('❌ Still getting error with Page ID:\n');
    
    if (error.response) {
      const { status, data } = error.response;
      console.error(`   Status Code: ${status}`);
      console.error(`   Error Code: ${data.error?.code}`);
      console.error(`   Error Message: ${data.error?.message}`);
      console.error(`   Full Error: ${JSON.stringify(data.error, null, 2)}`);
      
      if (data.error?.code === 3) {
        console.error(`\n💡 Error #3 persists. This might mean:`);
        console.error(`   1. The recipient needs to have messaged you within 24 hours`);
        console.error(`   2. You're trying to send a proactive message (first message)`);
        console.error(`   3. There's an app configuration issue in Meta Developer Console`);
        console.error(`\n   Check Meta Developer Console:`);
        console.error(`   - App Review → Permissions → instagram_manage_messages`);
        console.error(`   - Make sure it shows as "Standard Access" or "Approved"`);
        console.error(`   - Check if there are any warnings or requirements`);
      }
    } else {
      console.error(`   ${error.message}`);
    }
    
    process.exit(1);
  }
}

testWithPageId();

