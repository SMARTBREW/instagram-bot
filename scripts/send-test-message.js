const axios = require('axios');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const CONVERSATION_ID = '6926a0feb0a2e2b50aac8dbe'; // From your logs
const MESSAGE_TEXT = 'Hello! This is a test message from the API.';

// You need to provide your access token
// Get it by logging in: POST /v1/auth/login
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE';

async function sendMessage() {
  try {
    console.log('📤 Sending message...');
    console.log(`   Conversation ID: ${CONVERSATION_ID}`);
    console.log(`   Message: "${MESSAGE_TEXT}"`);

    const response = await axios.post(
      `${BASE_URL}/v1/messages/${CONVERSATION_ID}`,
      {
        text: MESSAGE_TEXT,
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Message sent successfully!');
    console.log('   Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error sending message:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN_HERE') {
  console.error('❌ Please provide your ACCESS_TOKEN:');
  console.error('   Option 1: Set environment variable: export ACCESS_TOKEN=your_token');
  console.error('   Option 2: Edit this script and replace YOUR_ACCESS_TOKEN_HERE');
  console.error('\n   To get a token, login first:');
  console.error('   curl -X POST http://localhost:3000/v1/auth/login \\');
  console.error('     -H "Content-Type: application/json" \\');
  console.error('     -d \'{"email":"testuser@example.com","password":"your_password"}\'');
  process.exit(1);
}

sendMessage();

