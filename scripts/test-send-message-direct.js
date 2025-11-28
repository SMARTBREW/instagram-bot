const axios = require('axios');

// Configuration
const PAGE_ACCESS_TOKEN = 'EAAT4veIIFZAABQJcGIxZCtL5Cz6qUMAlnitdxN5v45BoNAohfSZCBFqYZCgvsWRzcbDx3xEYYSHp6ZB069KLCYke4VzCgSQPzcR6NOXwSEu5O7qvZBy214hYhYtb7S3t43LZCplkQocPpsGqQQOwOCRg0lSv5ZBO0IkdQBgfmggRhjRXHqs3tLq1MYUzpC6KxdnfZAVk1w6Ow';
const INSTAGRAM_BUSINESS_ID = '17841476187112489';
const RECIPIENT_ID = '1416318236725299'; // The user who sent "okay" message
const MESSAGE_TEXT = 'Hello! This is a test reply from the API.';

async function testSendMessage() {
  try {
    console.log('📤 Testing direct message send to Meta API...\n');
    console.log(`   Recipient ID: ${RECIPIENT_ID}`);
    console.log(`   Message: "${MESSAGE_TEXT}"`);
    console.log(`   Instagram Business ID: ${INSTAGRAM_BUSINESS_ID}\n`);

    const url = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ID}/messages`;

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

    console.log('✅ Message sent successfully!');
    console.log(`   Message ID: ${response.data.message_id}`);
    console.log(`   Full Response: ${JSON.stringify(response.data, null, 2)}`);

  } catch (error) {
    console.error('❌ Error sending message:\n');
    
    if (error.response) {
      const { status, data } = error.response;
      console.error(`   Status Code: ${status}`);
      console.error(`   Error Code: ${data.error?.code}`);
      console.error(`   Error Type: ${data.error?.type}`);
      console.error(`   Error Message: ${data.error?.message}`);
      console.error(`   Error Subcode: ${data.error?.error_subcode}`);
      
      if (data.error?.error_user_title) {
        console.error(`   User Title: ${data.error?.error_user_title}`);
      }
      if (data.error?.error_user_msg) {
        console.error(`   User Message: ${data.error?.error_user_msg}`);
      }
      
      console.error(`\n   Full Error Response:`);
      console.error(JSON.stringify(data, null, 2));
      
      // Check for specific error codes
      if (data.error?.code === 3) {
        console.error(`\n💡 Error Code #3 Analysis:`);
        console.error(`   This usually means one of:`);
        console.error(`   1. App doesn't have required permissions (but you have them)`);
        console.error(`   2. Recipient hasn't messaged you within 24 hours (for Standard Access)`);
        console.error(`   3. Trying to send proactive message (first message) - needs Advanced Access`);
        console.error(`   4. App configuration issue`);
        console.error(`\n   Since recipient sent "okay" recently, check:`);
        console.error(`   - Was it within last 24 hours?`);
        console.error(`   - Is this a reply or first message?`);
      }
    } else {
      console.error(`   ${error.message}`);
    }
    
    process.exit(1);
  }
}

testSendMessage();

