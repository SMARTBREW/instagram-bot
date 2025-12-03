# Meta App Review - Access Instructions

## Overview

This is a server-to-server backend application with a demonstration UI frontend. Administrators configure Page Access Tokens in our environment; all Meta API calls (`instagram_manage_messages`, `instagram_basic`) occur on the server. Reviewers do not need to sign into Facebook within the app.

**No Facebook Login:** This product operates solely with admin-managed Page Access Tokens. There is no Facebook Login UI or user-facing Meta authentication flow.

---

## 🌐 Frontend UI Access (Recommended for Review)

### Web Application URL:
**https://[YOUR-VERCEL-URL].vercel.app** (or the deployed frontend URL)

### Quick Start:
1. **Open the web application** in your browser
2. **Login** with reviewer credentials:
   - Email: `reviewer@example.com`
   - Password: `Reviewer123`
3. **View connected account:** The UI shows Instagram Business Account `@beher_hope` (ID: `17841476187112489`)
4. **View profile:** Profile section displays account details fetched via `instagram_basic` (name, bio, followers, media list)
5. **View conversations:** Click "View conversations" to see message threads
6. **Test receiving messages:** Send a DM from Instagram app to `@beher_hope` - it appears automatically in the UI
7. **Test sending messages:** Type a reply and click "Send reply" - uses `instagram_manage_messages` permission

### UI Features Demonstrated:
- **Account visibility:** Handle `@beher_hope` and ID `17841476187112489` visible throughout
- **Profile display:** Live retrieval of profile fields (name, bio, followers, media) via `instagram_basic`
- **Media list:** Recent posts displayed and labeled for account `@beher_hope`
- **Two-way messaging:** 
  - Receiving: Messages appear automatically via webhook (`instagram_manage_messages`)
  - Sending: Reply form shows account handle, sends via Graph API (`instagram_manage_messages`)

---

## 🔧 Backend API Access (Alternative Testing Method)

### Base URL:
**https://instagram-bot-xmt8.onrender.com**

### Health Check:
```
GET /health-check → returns "OK"
```

### Webhook Endpoint:
```
https://instagram-bot-xmt8.onrender.com/v1/webhook
Webhook verify token: your-custom-verify-token
```

### Authentication:
1. **POST /v1/auth/login** with reviewer credentials:
   ```json
   {
     "email": "reviewer@example.com",
     "password": "Reviewer123"
   }
   ```
2. Copy `access.token` from the JSON response
3. Include header `Authorization: Bearer <token>` in all API calls

### Verify Instagram Connection:
```
GET /v1/instagram
```
Returns the connected Instagram Business Account (`instagramBusinessId: 17841476187112489`). The Page Access Token is stored server-side.

### Test Receiving Messages (`instagram_manage_messages`):
1. Send a DM from any Instagram account to `@beher_hope` (shown in screencast)
2. Webhook `POST /v1/webhook` receives the event and stores the message
3. `GET /v1/conversations/<instagramAccountId>` → shows stored conversation with fields:
   - `igUserId`
   - `igUsername` (retrieved via `instagram_basic`)
   - `messageId`
   - `text`
   - `timestamp`

### Test Sending Replies (`instagram_manage_messages`):
```
POST /v1/messages/<conversationId>
Content-Type: application/json
Authorization: Bearer <token>

{
  "text": "Test reply from App Review"
}
```
Response includes Meta `message_id`; the DM appears instantly in Instagram (if permission is approved).

### Test Profile Retrieval (`instagram_basic`):
```
GET /v1/instagram/<accountId>/profile
Authorization: Bearer <token>
```
Returns profile fields: username, name, biography, followers count, profile picture, and media list - all fetched using `instagram_basic` permission.

### Webhook Verification (Optional):
```
GET /v1/webhook?hub.mode=subscribe&hub.verify_token=your-custom-verify-token&hub.challenge=test123
```
Server echoes the challenge token.

---

## 📋 Testing Checklist

### For UI Testing:
- [ ] Access web application URL
- [ ] Login with reviewer credentials
- [ ] See account `@beher_hope` (ID: `17841476187112489`) visible
- [ ] View profile section showing: name, bio, followers, media list
- [ ] Send test message from Instagram app to `@beher_hope`
- [ ] See message appear automatically in UI
- [ ] Send reply from UI (may show permission error if not approved - this is expected)
- [ ] See account handle visible in all sections

### For API Testing:
- [ ] Health check returns "OK"
- [ ] Login endpoint returns access token
- [ ] GET /v1/instagram returns account details
- [ ] GET /v1/instagram/<accountId>/profile returns profile data
- [ ] Webhook receives test message
- [ ] GET /v1/conversations returns conversations with usernames
- [ ] POST /v1/messages sends reply (may error if permission not approved)

---

## 🔑 Reviewer Credentials

**Email:** `reviewer@example.com`  
**Password:** `Reviewer123`

These credentials are provided in the secure Notes section as well.

---

## 📝 Important Notes

1. **Server-to-server architecture:** No Facebook Login UI exists. All Meta API calls use Page Access Tokens configured server-side.

2. **Account visibility:** The Instagram Business Account handle `@beher_hope` and ID `17841476187112489` are visible throughout the UI and API responses.

3. **Permission status:** If sending messages fails with a permission error, this is expected during App Review. Once `instagram_manage_messages` is approved, the same API call will work successfully.

4. **Webhook testing:** To test webhook reception, send a DM from any Instagram account to `@beher_hope`. The message will appear in the UI automatically (auto-refreshes every 5-8 seconds).

5. **Profile demonstration:** The profile section demonstrates `instagram_basic` by fetching account details including media list, all labeled for account `@beher_hope`.

---

## 🆘 Troubleshooting

- **UI not loading:** Check that the frontend URL is correct and deployed
- **Login fails:** Verify credentials: `reviewer@example.com` / `Reviewer123`
- **No accounts shown:** Account is pre-configured - refresh the page
- **Messages not appearing:** Check that webhook is configured correctly in Meta Developer Portal
- **Send fails:** Expected if permission not approved - error message explains this

---

**For questions or issues, refer to the screencast which demonstrates the complete end-to-end flow.**

