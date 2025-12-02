# 📹 Meta App Review Screencast Script V2

## Total Duration: ~4-5 minutes

---

## 🎬 Part 1: Introduction & Login (0:00 - 0:30)

**Screen:** Show the web app at `https://instagram-bot-xmt8.onrender.com` or `localhost:3001`

**Narration:**
> "This is our Instagram messaging support tool. It's a server-to-server application using Page Access Tokens - there's no Facebook Login UI. I'll demonstrate how we use instagram_basic and instagram_manage_messages permissions."

**Action:**
- Show login form
- Enter: `reviewer@example.com` / `Reviewer123`
- Click "Login and fetch accounts"
- **Caption:** "Step 1: Login via JWT (no Facebook Login required - server-to-server app)"

---

## 🎬 Part 2: Account Selection & Profile Display (0:30 - 1:30)

**Screen:** Accounts list appears

**Narration:**
> "Here's our connected Instagram Business Account. Notice the handle and ID are clearly visible."

**Action:**
- Point to account showing: `@beher_hope` and `ID: 17841476187112489`
- Click "View conversations"
- **Caption:** "Step 2: Connected Instagram account (@beher_hope, ID: 17841476187112489)"

**Screen:** Profile section loads

**Narration:**
> "This profile section demonstrates instagram_basic permission. Watch as we fetch profile details live."

**Action:**
- Point to profile section loading
- Show profile picture, handle, name, bio, followers count, posts count
- Scroll to show media grid (recent posts)
- **Caption:** "Step 3: Fetching profile via instagram_basic - shows name, bio, followers, and media list"

**Highlight:**
- Make sure handle `@beher_hope` is clearly visible
- Make sure Instagram Business ID `17841476187112489` is visible
- Show media grid with actual posts

---

## 🎬 Part 3: Receiving Messages (1:30 - 2:30)

**Screen:** Conversations list

**Narration:**
> "Now I'll show how we receive messages using instagram_manage_messages permission."

**Action:**
- Show conversations list (if any exist)
- **Switch to phone/Instagram app:**
  - Open Instagram app
  - Send a test message to `@beher_hope` account
  - Message: "Hello, testing the webhook"
- **Switch back to web app:**
  - Wait 2-3 seconds
  - Show new message appearing in conversations list
  - Show username fetched via instagram_basic
- Click on the conversation
- Show messages loading in chat view
- **Caption:** "Step 4: Message received via webhook (instagram_manage_messages) - username fetched via instagram_basic"

**Highlight:**
- Keep account handle `@beher_hope` visible in UI
- Show the incoming message with timestamp
- Show username in conversation list

---

## 🎬 Part 4: Sending Messages (2:30 - 3:30)

**Screen:** Chat view with selected conversation

**Narration:**
> "Now I'll send a reply using instagram_manage_messages permission."

**Action:**
- Type message in text area: "Thank you for your message! This is a test reply."
- Click "Send reply"
- Show the API call happening
- **If permission not approved yet:**
  - Show error message: "Cannot send: instagram_manage_messages permission not yet approved"
  - Explain: "This is expected during review - once approved, this will work"
- **If permission is approved:**
  - Show success message
  - **Switch to phone/Instagram app:**
    - Show message appearing in Instagram DM
    - Show it's from `@beher_hope` account
- **Caption:** "Step 5: Sending reply via instagram_manage_messages - message appears in Instagram"

**Highlight:**
- Keep account handle visible throughout
- Show the send button click
- Show message in Instagram app (if permission approved)

---

## 🎬 Part 5: Receiving Reply (3:30 - 4:15)

**Screen:** Web app chat view

**Narration:**
> "Now I'll show receiving a reply back in our app UI."

**Action:**
- **Switch to phone/Instagram app:**
  - Reply to the message from test account
  - Message: "Got it, thanks!"
- **Switch back to web app:**
  - Wait 2-3 seconds
  - Show new message appearing automatically in chat view
  - Show it's from the customer (blue bubble, left side)
- **Caption:** "Step 6: Reply received via webhook - appears automatically in app UI"

**Highlight:**
- Show account handle still visible
- Show the reply message clearly
- Show it's in the correct conversation

---

## 🎬 Part 6: Summary (4:15 - 4:30)

**Screen:** Show both profile section and messages side by side

**Narration:**
> "To summarize: We've demonstrated instagram_basic by fetching profile details including handle, bio, followers, and media. We've demonstrated instagram_manage_messages by receiving messages via webhook and sending replies via Graph API. The account handle @beher_hope and ID 17841476187112489 were visible throughout."

**Action:**
- Pan across the UI showing:
  - Profile section with handle and media
  - Conversations with usernames
  - Messages being sent/received
- **Caption:** "Complete flow: Profile fetch (instagram_basic) + Messaging (instagram_manage_messages)"

---

## ✅ Checklist Before Recording

- [ ] Account handle `@beher_hope` is clearly visible
- [ ] Instagram Business ID `17841476187112489` is visible
- [ ] Profile section shows: name, bio, followers, media list
- [ ] Can send a test message from phone to `@beher_hope`
- [ ] Can see incoming messages in web app
- [ ] Can send reply from web app (even if it errors due to permission)
- [ ] Can receive reply back in web app
- [ ] All captions are in English
- [ ] UI is in English
- [ ] Total duration is under 5 minutes

---

## 🎯 Key Points to Emphasize

1. **Account Visibility:** Handle and ID must be visible throughout
2. **Two-way messaging:** Send FROM app TO Instagram, receive FROM Instagram TO app
3. **Profile retrieval:** Show live fetch of profile fields and media
4. **Server-to-server:** Mention this is server-to-server, no Facebook Login UI
5. **Real functionality:** Use actual Instagram account, not mockups

---

## 📝 Submission Notes Update

Add this to your submission notes:

```
## Screencast Demonstration

The screencast shows:

1. **Account Selection:** Instagram Business Account @beher_hope (ID: 17841476187112489) is clearly visible throughout

2. **instagram_basic Usage:**
   - Live retrieval of profile fields: name, biography, followers count, profile picture
   - Media list displayed showing recent posts from the account
   - All data fetched using business_discovery API with instagram_basic permission

3. **instagram_manage_messages Usage:**
   - Receiving messages: Test message sent from Instagram app to @beher_hope, appears automatically in our web UI via webhook
   - Sending messages: Reply sent from our web UI, appears in Instagram app
   - Two-way messaging demonstrated with account handle visible in both directions

4. **Server-to-server Architecture:**
   - No Facebook Login UI (uses Page Access Tokens configured server-side)
   - All Meta API calls happen server-to-server
   - Web UI is for demonstration purposes only
```

