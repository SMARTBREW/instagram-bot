# 🔗 Instagram Webhook Setup Guide

This guide will help you set up ngrok and configure Meta's webhook to receive real Instagram messages.

---

## 📋 Prerequisites

- ✅ Server running on port 3000 (`npm run dev`)
- ✅ Meta App ID: `1526863238529596`
- ✅ Instagram Business Account connected
- ✅ `.env` file configured

---

## 🚀 Step-by-Step Setup

### **Step 1: Install ngrok**

#### Option A: Using Homebrew (Recommended)

```bash
brew install ngrok/ngrok/ngrok
```

#### Option B: Manual Download

1. Visit: https://ngrok.com/download
2. Download macOS version
3. Unzip and move to `/usr/local/bin`:

```bash
unzip ~/Downloads/ngrok-v3-stable-darwin-amd64.zip
sudo mv ngrok /usr/local/bin/ngrok
```

#### Verify Installation

```bash
ngrok version
# Should output: ngrok version 3.x.x
```

---

### **Step 2: Sign Up & Get Auth Token**

1. **Sign up for free account:**
   - Visit: https://ngrok.com/signup
   - Sign up with email or GitHub

2. **Get your auth token:**
   - Go to: https://dashboard.ngrok.com/get-started/your-authtoken
   - Copy your authtoken

3. **Add auth token to ngrok:**

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

✅ You should see: `Authtoken saved to configuration file`

---

### **Step 3: Start Your Server**

Make sure your Instagram bot server is running:

```bash
cd /Users/ayushanand/Developer/instagram-bot
npm run dev
```

You should see:
```
info: Connected to MongoDB
info: Listening to port 3000
```

**Keep this terminal open!**

---

### **Step 4: Start ngrok Tunnel**

Open a **NEW terminal** and run:

```bash
cd /Users/ayushanand/Developer/instagram-bot
./start-webhook.sh
```

Or manually:

```bash
ngrok http 3000
```

You'll see output like this:

```
ngrok                                                                    

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       20ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123xyz.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**📋 COPY THIS URL:** `https://abc123xyz.ngrok.io` (your URL will be different)

---

### **Step 5: Configure Meta Webhook**

1. **Go to Meta Developer Portal:**
   - Visit: https://developers.facebook.com/apps/1526863838529596/
   - Login with your Meta account

2. **Navigate to Instagram Settings:**
   - Click **"Instagram"** in left sidebar
   - Click **"Configuration"**
   - Scroll to **"Webhooks"** section

3. **Set Callback URL:**
   - Click **"Edit"** or **"Add Callback URL"**
   - Enter: `https://YOUR-NGROK-URL.ngrok.io/v1/webhook`
   - Example: `https://abc123xyz.ngrok.io/v1/webhook`

4. **Set Verify Token:**
   - Enter: `your-custom-verify-token`
   - (This MUST match `META_VERIFY_TOKEN` in your `.env` file)

5. **Click "Verify and Save"**
   - Meta will send a GET request to verify your webhook
   - You should see: ✅ **"Valid"** or **"Success"**

6. **Subscribe to Webhook Fields:**
   - Check these boxes:
     - ✅ `messages`
     - ✅ `messaging_postbacks`
     - ✅ `message_reactions`
     - ✅ `message_reads`
   - Click **"Save"**

---

### **Step 6: Test Your Webhook**

#### Test 1: Check ngrok Web Interface

1. Open in browser: http://127.0.0.1:4040
2. You'll see all requests coming through ngrok
3. You should see Meta's verification GET request

#### Test 2: Send a Test Message

1. **Open Instagram app on your phone**
2. **Send a DM to your Instagram Business account**
3. **Watch your terminal logs:**

You should see:
```
info: Webhook event received
info: Message stored from user 1234567890
```

#### Test 3: Check Database

Run this to verify message was stored:

```bash
# In a new terminal
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!"
  }'

# Copy the access token, then:
curl -X GET "http://localhost:3000/v1/conversations/YOUR_INSTAGRAM_ACCOUNT_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔍 Troubleshooting

### ❌ "Webhook Verification Failed"

**Problem:** Meta shows "Invalid" when verifying webhook

**Solutions:**
1. Check that `META_VERIFY_TOKEN` in `.env` matches what you entered in Meta
2. Make sure your server is running
3. Verify ngrok URL is correct and includes `/v1/webhook`
4. Check server logs for errors

### ❌ "URL is unreachable"

**Problem:** Meta can't reach your ngrok URL

**Solutions:**
1. Make sure ngrok is running (check for "Session Status: online")
2. Test URL yourself: `curl https://YOUR-NGROK-URL.ngrok.io/health-check`
3. Try restarting ngrok
4. Free ngrok URLs expire - get a new one if it's been running a while

### ❌ "Messages not being received"

**Problem:** Webhook verified but messages don't appear

**Solutions:**
1. Check you subscribed to `messages` field in Meta
2. Verify Instagram account is connected in your database
3. Check server logs for errors: look in terminal running `npm run dev`
4. Test with ngrok inspector: http://127.0.0.1:4040

### ❌ ngrok "Session Expired"

**Problem:** Free ngrok sessions expire after 2 hours

**Solutions:**
1. Restart ngrok: `ngrok http 3000`
2. Update webhook URL in Meta with new ngrok URL
3. Upgrade to ngrok paid plan for permanent URLs

---

## 📊 Verify Everything is Working

Run this checklist:

```bash
# 1. Check server is running
curl http://localhost:3000/health-check
# Should return: OK

# 2. Check ngrok is tunneling
curl https://YOUR-NGROK-URL.ngrok.io/health-check
# Should return: OK

# 3. Check webhook endpoint (simulate Meta verification)
curl -X GET "http://localhost:3000/v1/webhook?hub.mode=subscribe&hub.verify_token=your-custom-verify-token&hub.challenge=test123"
# Should return: test123
```

---

## 🎯 What Happens When Someone Messages You?

1. **User sends Instagram DM** → Instagram servers
2. **Instagram servers** → Meta Graph API
3. **Meta Graph API** → Webhook POST to your ngrok URL
4. **ngrok** → Tunnels to localhost:3000
5. **Your server** → Receives webhook, processes message
6. **Your server** → Stores message in MongoDB
7. **Your server** → Can send auto-reply (if implemented)

---

## 📝 Important Notes

### ngrok Free Plan Limitations:
- ✅ Perfect for development/testing
- ⚠️ URL changes every time you restart ngrok
- ⚠️ Sessions expire after 2 hours
- ⚠️ Limited to 40 connections/minute

### For Production:
- Use ngrok paid plan ($8/month) for permanent URLs
- Or deploy to a real server (Heroku, AWS, DigitalOcean, Railway, etc.)
- Use a proper domain with SSL certificate

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Meta Developer Portal shows "Valid" webhook
2. ✅ ngrok inspector (http://127.0.0.1:4040) shows POST requests from Meta
3. ✅ Server logs show: `info: Webhook event received`
4. ✅ Server logs show: `info: Message stored from user XXXXX`
5. ✅ You can retrieve messages via API

---

## 🆘 Need Help?

Check these resources:
- **ngrok Docs:** https://ngrok.com/docs
- **Meta Webhooks:** https://developers.facebook.com/docs/instagram-api/guides/webhooks
- **Your ngrok Dashboard:** https://dashboard.ngrok.com
- **Meta App Dashboard:** https://developers.facebook.com/apps/1526863838529596

---

## ⚡ Quick Start Commands

```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Then configure webhook in Meta Developer Portal
```

That's it! You're now ready to receive Instagram messages! 🎊

