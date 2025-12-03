# 🎬 Complete Meta App Review Screencast Script

## Total Duration: ~4-5 minutes

---

## 🎯 **PART 1: Introduction & Login** (0:00 - 0:35)

### Screen Setup:
- Open browser to `https://instagram-bot-xmt8.onrender.com` or `localhost:3001`
- Make sure browser window is maximized
- Have phone with Instagram app ready nearby

### Narration:
> "This screencast demonstrates our Instagram messaging support tool. This is a server-to-server application using Page Access Tokens - there's no Facebook Login UI. I'll show how we use both instagram_basic and instagram_manage_messages permissions."

### Actions:
1. **Show the login page**
   - Point to the yellow header: "Instagram DM Demo" with "Permissions: instagram_manage_messages + instagram_basic"
   - Point to the white card: "Step 1 · Login (JWT)"
   - Point to the login form with email and password fields
   - **Caption:** "Step 1: Login via JWT (Server-to-server app - no Facebook Login required)"

2. **Enter credentials:**
   - Email field: `reviewer@example.com` (already pre-filled)
   - Password field: `Reviewer123` (already pre-filled)
   - Click the black "Login and fetch accounts" button
   - **Caption:** "Authenticating with backend API"

3. **Wait for accounts to load**
   - Show the UI transitioning to "Step 2 · Connected Instagram account"
   - **Caption:** "Fetching connected Instagram accounts"

---

## 🎯 **PART 2: Account Selection & Profile Display (instagram_basic)** (0:35 - 2:00)

### Screen:
- "Step 2 · Connected Instagram account" view appears

### Narration:
> "Here's our connected Instagram Business Account. Notice the handle and ID are clearly visible."

### Actions:
1. **Show the account card:**
   - Point to the white card with border showing the account
   - Show username: `@beher_hope` (or the Instagram Business ID)
   - Show the ID below: `ID: 17841476187112489`
   - **Caption:** "Step 2: Connected Instagram Business Account - @beher_hope (ID: 17841476187112489)"

2. **Click the yellow "View conversations" button**
   - **Caption:** "Opening account dashboard"

3. **Show "Step 3 · Conversations & messages" view:** 
   - Point to the yellow header at top: "Instagram DM Demo"
   - Point to the account banner: "📱 Account: @beher_hope (ID: 17841476187112489)"
   - **Caption:** "Account handle and ID visible at top of conversations view"

4. **Show the Profile Display Section:**
   - Point to the yellow-bordered box with background color #fffef5
   - Point to header: "📊 Profile Details for @beher_hope (via instagram_basic permission)"
   - Show "Loading profile..." text appears
   - **Caption:** "Step 3: Live retrieval of profile data via instagram_basic permission"

5. **Profile data appears in the grid layout:**
   - **Point to each field as it loads:**
     - Profile picture (circular, 80x80px, yellow border)
     - Handle: `@beher_hope`
     - Name: (show actual name from API)
     - Bio: (show actual biography)
     - Followers: (show formatted count)
     - Posts: (show media count)
     - Website: (if available)
   - **Caption:** "Profile fields retrieved: name, biography, followers count, profile picture"

6. **Scroll to media section:**
   - Point to label: "Recent Media for @beher_hope (via instagram_basic):"
   - **Caption:** "Media list labeled for account @beher_hope"

7. **Show media grid:**
   - Point to the grid of post thumbnails (80px squares)
   - Show media type indicators (📷 for photos, ▶ for videos) in top-right corner
   - Point to each post image
   - **Caption:** "Recent posts displayed - all fetched using instagram_basic permission"

8. **Emphasize visibility:**
   - Pan across showing account handle visible in:
     - Top yellow header
     - Account banner: "📱 Account: @beher_hope (ID: 17841476187112489)"
     - Profile section header: "Profile Details for @beher_hope"
     - Media section label: "Recent Media for @beher_hope"
   - **Caption:** "Account handle @beher_hope and ID 17841476187112489 visible throughout"

---

## 🎯 **PART 3: Receiving Messages (instagram_manage_messages)** (2:00 - 3:00)

### Screen:
- Web app showing "Step 3 · Conversations & messages" view
- Two-column layout: conversations list (left) and message area (right)
- Phone with Instagram app ready

### Narration:
> "Now I'll demonstrate receiving messages using instagram_manage_messages permission. Watch as a message sent from Instagram appears automatically in our app UI."

### Actions:
1. **Show the conversations list (left panel):**
   - Point to the beige background panel (#faf7ee)
   - Show existing conversations (if any) with usernames like "@user_49735677"
   - Show unread count badges (red circles with numbers)
   - Point to account handle still visible at top: "📱 Account: @beher_hope (ID: 17841476187112489)"
   - **Caption:** "Step 4: Conversations view - account @beher_hope visible"

2. **Switch to phone:**
   - Open Instagram app
   - Navigate to DMs
   - Find `@beher_hope` account
   - **Caption:** "Sending test message from Instagram app to @beher_hope"

3. **Send message from phone:**
   - Type: "Hello, this is a test message for the review"
   - Send the message
   - **Caption:** "Message sent to @beher_hope account"

4. **Switch back to web app:**
   - Wait 2-3 seconds (auto-refresh happens every 8 seconds)
   - Show new conversation appearing in the left panel
   - Point to username like "@user_49735677" (fetched via instagram_basic)
   - Show last message preview
   - **Caption:** "Message received via webhook (instagram_manage_messages) - username fetched via instagram_basic"

5. **Click on the conversation in left panel:**
   - Conversation highlights in yellow (#f5cd4c)
   - Right panel shows "Conversation with @username"
   - Show messages loading in the chat area
   - **Caption:** "Opening conversation to view messages"

6. **Show message in chat view (right panel):**
   - Point to the message area with beige background (#fafafa)
   - Point to blue message bubble (left side): "#e3f2fd" background
   - Show sender label: "Customer (@username)"
   - Show message text
   - Show timestamp at bottom
   - **Caption:** "Message displayed in app UI - account @beher_hope visible in header"

7. **Emphasize account visibility:**
   - Point to conversation header in right panel showing:
     - "Conversation with @username"
     - "igUserId: [ID]"
     - "📱 Sending from: @beher_hope (ID: 17841476187112489)"
   - **Caption:** "Account handle visible when receiving messages"

---

## 🎯 **PART 4: Sending Messages (instagram_manage_messages)** (3:00 - 4:00)

### Screen:
- Web app showing right panel with conversation open
- Send form at bottom of right panel
- Phone with Instagram app ready

### Narration:
> "Now I'll demonstrate sending a message from our app to Instagram using instagram_manage_messages permission. Notice the account handle is visible throughout."

### Actions:
1. **Show send form at bottom of right panel:**
   - Point to the label: "Send reply from @beher_hope (uses instagram_manage_messages)"
   - Point to the white textarea with border
   - Point to the black "Send reply" button
   - **Caption:** "Step 5: Send form - account @beher_hope clearly visible"

2. **Type message in textarea:**
   - Click in the textarea
   - Type: "Thank you for your message! This is a test reply from our app."
   - **Caption:** "Composing reply message"

3. **Click the black "Send reply" button:**
   - Show button click
   - Show status text appearing: "Sending…"
   - **Caption:** "Sending message via Graph API using instagram_manage_messages"

4. **If permission not approved (expected during review):**
   - Show error message appearing: "❌ Cannot send: The instagram_manage_messages permission is not yet approved by Meta..."
   - **Say:** "This error is expected during App Review. Once the permission is approved, this same call will work successfully."
   - **Caption:** "Permission not yet approved - expected during review"

5. **If permission IS approved:**
   - Show success message: "✅ Message sent successfully!"
   - **Switch to phone:**
     - Open Instagram app
     - Navigate to DM with `@beher_hope`
     - Show message appearing: "Thank you for your message! This is a test reply from our app."
     - Show it's from `@beher_hope` account
   - **Caption:** "Message sent successfully - appears in Instagram app from @beher_hope"

6. **Switch back to web app:**
   - Show yellow message bubble appearing in chat area (right side): "#fff9c4" background
   - Show sender label: "You (from @beher_hope)"
   - Show message text
   - Show timestamp
   - **Caption:** "Sent message appears in app UI - account handle visible"

7. **Emphasize account visibility:**
   - Pan across showing:
     - Account handle in top banner: "📱 Account: @beher_hope (ID: 17841476187112489)"
     - Account handle in conversation header: "📱 Sending from: @beher_hope"
     - Account handle in send form label: "Send reply from @beher_hope"
     - Account handle in sent message: "You (from @beher_hope)"
   - **Caption:** "Account @beher_hope visible throughout send process"

---

## 🎯 **PART 5: Receiving Reply Back (instagram_manage_messages)** (4:00 - 4:45)

### Screen:
- Web app showing right panel with conversation open
- Messages visible in chat area
- Phone with Instagram app

### Narration:
> "Finally, I'll show receiving a reply back in our app UI, completing the two-way messaging demonstration."

### Actions:
1. **Switch to phone:**
   - Open Instagram app
   - Find the conversation with `@beher_hope`
   - **Caption:** "Sending reply from Instagram app to @beher_hope"

2. **Send reply from phone:**
   - Type: "Got it, thanks for the reply!"
   - Send the message
   - **Caption:** "Reply sent to @beher_hope account"

3. **Switch back to web app:**
   - Wait 2-3 seconds (auto-refresh happens every 5 seconds for messages)
   - Show new message appearing automatically in the chat area (beige background #fafafa)
   - **Caption:** "Step 6: Reply received via webhook - appears automatically in app UI"

4. **Show the received message:**
   - Point to blue message bubble appearing (left side): "#e3f2fd" background
   - Show sender label: "Customer (@username)"
   - Show message text: "Got it, thanks for the reply!"
   - Show timestamp at bottom
   - **Caption:** "Message received - account @beher_hope visible in header"

5. **Show auto-refresh working:**
   - Point to the chat area
   - Mention that messages refresh every 5 seconds automatically
   - **Caption:** "Auto-refresh shows new messages in real-time"

6. **Emphasize two-way messaging:**
   - Show both message bubbles in the chat area:
     - Outgoing (yellow, right): "You (from @beher_hope)" - "#fff9c4" background
     - Incoming (blue, left): "Customer (@username)" - "#e3f2fd" background
   - Point to account handle still visible in header: "📱 Sending from: @beher_hope"
   - **Caption:** "Two-way messaging demonstrated - account handle visible in both directions"

---

## 🎯 **PART 6: Summary & Final View** (4:45 - 5:00)

### Screen:
- Show full UI: yellow header, profile section, conversations, and messages

### Narration:
> "To summarize: We've demonstrated instagram_basic by fetching profile details including handle, name, bio, followers, and media list - all labeled for account @beher_hope. We've demonstrated instagram_manage_messages by receiving messages via webhook and sending replies via Graph API. The account handle @beher_hope and ID 17841476187112489 were visible throughout all operations."

### Actions:
1. **Pan across UI showing:**
   - Yellow header: "Instagram DM Demo" with permissions listed
   - Account banner: "📱 Account: @beher_hope (ID: 17841476187112489)"
   - Yellow-bordered profile section: "Profile Details for @beher_hope" with all fields
   - Media grid: "Recent Media for @beher_hope" with post thumbnails
   - Left panel: Conversations list with usernames
   - Right panel: Messages showing "You (from @beher_hope)" and "Customer (@username)"
   - **Caption:** "Complete demonstration: Profile (instagram_basic) + Messaging (instagram_manage_messages)"

2. **Final emphasis:**
   - Point to account handle in multiple places:
     - Top banner
     - Profile section header
     - Media section label
     - Conversation header
     - Send form label
     - Message sender labels
   - Point to ID visible: "17841476187112489"
   - **Caption:** "Account @beher_hope (ID: 17841476187112489) visible throughout entire flow"

---

## ✅ **Pre-Recording Checklist**

Before you start recording, verify:

- [ ] Web app is running and accessible
- [ ] Phone has Instagram app open and ready
- [ ] Test account can send messages to `@beher_hope`
- [ ] Account handle `@beher_hope` is visible in UI
- [ ] Account ID `17841476187112489` is visible in UI
- [ ] Profile section loads correctly
- [ ] Media grid shows posts
- [ ] Can send test message from phone
- [ ] Can see incoming messages in web app
- [ ] Can send reply from web app (even if it errors)
- [ ] Screen recording software is ready
- [ ] Audio is clear
- [ ] Browser window is maximized

---

## 📝 **Caption Guidelines**

Add these captions during editing:

1. **Step 1:** "Login via JWT (Server-to-server app)"
2. **Step 2:** "Account: @beher_hope (ID: 17841476187112489)"
3. **Step 3:** "Live profile retrieval via instagram_basic"
4. **Step 4:** "Message received via webhook (instagram_manage_messages)"
5. **Step 5:** "Sending reply via instagram_manage_messages"
6. **Step 6:** "Reply received in app UI"

**Key visibility captions:**
- "Account handle @beher_hope visible"
- "Account ID 17841476187112489 visible"
- "Media labeled for @beher_hope"
- "Profile fields: name, bio, followers, media"

---

## 🎬 **Recording Tips**

1. **Speak clearly and slowly** - Reviewers need to understand each step
2. **Pause between actions** - Give time to see what's happening
3. **Use cursor to point** - Highlight important elements
4. **Show account handle** - Make sure it's visible in every shot
5. **Show both screens** - Web app AND Instagram app when sending/receiving
6. **Keep it under 5 minutes** - Reviewers have limited time
7. **Add captions** - Use text overlays to explain each step
8. **Test first** - Do a dry run before recording

---

## 🎯 **Key Points to Emphasize**

1. ✅ Account handle `@beher_hope` visible throughout
2. ✅ Account ID `17841476187112489` visible throughout
3. ✅ Profile fields retrieved live (not cached)
4. ✅ Media list labeled for the account
5. ✅ Two-way messaging demonstrated
6. ✅ Account visible when sending
7. ✅ Account visible when receiving
8. ✅ Server-to-server architecture (no Facebook Login)

---

**Ready to record! Follow this script step-by-step and you'll cover all reviewer requirements.** 🎬

