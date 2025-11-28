#!/bin/bash

# Instagram Bot Webhook Setup Script
# This script helps you start your server and ngrok together

echo "🚀 Starting Instagram Bot Webhook Setup..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed!"
    echo ""
    echo "Please install ngrok first:"
    echo "  brew install ngrok/ngrok/ngrok"
    echo ""
    echo "Or download from: https://ngrok.com/download"
    exit 1
fi

# Check if server is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Server is already running on port 3000"
else
    echo "❌ Server is not running on port 3000"
    echo ""
    echo "Please start your server first:"
    echo "  npm run dev"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "🌐 Starting ngrok tunnel on port 3000..."
echo ""
echo "================================================"
echo "  NGROK INSTRUCTIONS"
echo "================================================"
echo ""
echo "1. Copy the 'Forwarding' HTTPS URL (e.g., https://abc123.ngrok.io)"
echo "2. Go to: https://developers.facebook.com/apps/${META_APP_ID:-YOUR_APP_ID}"
echo "3. Navigate to: Instagram → Configuration → Webhooks"
echo "4. Set Callback URL: YOUR_NGROK_URL/v1/webhook"
echo "5. Set Verify Token: your-custom-verify-token"
echo "6. Subscribe to: messages, messaging_postbacks, message_reactions, message_reads"
echo ""
echo "================================================"
echo ""

# Start ngrok
ngrok http 3000

