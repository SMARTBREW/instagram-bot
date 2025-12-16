# 🎬 Two-Window Screencast Script for Meta App Review

## Overview
This script demonstrates `instagram_manage_messages` using two browser windows side-by-side, showing messaging between two different Instagram accounts.

## Setup

### Window 1 (Left Side):
- **Account:** `@beher_hope`
- **Login:** `reviewer@example.com` / `Reviewer123`
- **Purpose:** Send messages FROM this account

### Window 2 (Middle - Optional):
- **Account:** `@women_cause`
- **Login:** `womencause2@example.com` / `WomenCause123`
- **Purpose:** Show receiving in app UI

### Browser Tab/Window 3 (Right Side):
- **Instagram Web:** `instagram.com`
- **Login:** As `@women_cause` account
- **Purpose:** Show message appearing in Instagram web client (native client)

### Phone (Alternative):
- Instagram mobile app showing `@women_cause` account
- Use if Meta specifically requires mobile app demonstration

---

## Screencast Flow (4-5 minutes)

### PART 1: Setup & Asset Selection (0:00 - 1:00)

#### Show Both Windows Side-by-Side:

**Window 1 (Left):**
1. Show login page
2. Enter: `reviewer@example.com` / `Reviewer123`
3. Click "Log In"
4. Show account: `@beher_hope` appears
5. Click account to open conversations
6. **Point to account handle:** "📱 Account: @beher_hope (ID: 17841476187112489)"
7. **Caption:** "Window 1: Account @beher_hope - Asset Selection Visible"

**Window 2 (Right):**
1. Show login page
2. Enter: `womencause2@example.com` / `WomenCause123`
3. Click "Log In"
4. Show account: `@women_cause` appears
5. Click account to open conversations
6. **Point to account handle:** Show account visible
7. **Caption:** "Window 2: Account @women_cause - Asset Selection Visible"

**Narration:**
> "I'm setting up two windows to demonstrate messaging between accounts. Window 1 shows account @beher_hope, and Window 2 shows account @women_cause. Notice both account handles and IDs are clearly visible - this demonstrates asset selection."

---

### PART 2: Receiving Message (1:00 - 2:00)

**Window 2 (Right) - Receiving:**
1. Show empty conversation list or existing conversations
2. **Say:** "I'll send a message from Window 1, and it will appear in Window 2"

**Window 1 (Left) - Sending:**
1. Find or create conversation with `@women_cause`
2. Type message: "Hello! This is a test message sent from @beher_hope account. Testing instagram_manage_messages permission."
3. Click "Send"
4. Show "✅ Message sent successfully!"
5. **Caption:** "REQUIREMENT 2: Live Send Action - Message sent from Window 1"

**Window 2 (Right) - Receiving:**
1. Wait 2-3 seconds (auto-refresh)
2. Show new message appearing automatically
3. Point to message bubble showing the text
4. Point to sender: "From @beher_hope"
5. **Caption:** "Message received in Window 2 - Appears automatically via webhook"

**Narration:**
> "I sent a message from Window 1 using the @beher_hope account. The message appears automatically in Window 2, demonstrating that instagram_manage_messages allows us to send messages that are received via webhook."

---

### PART 3: Two-Way Messaging (2:00 - 3:30)

**Window 2 (Right) - Replying:**
1. Select the conversation with `@beher_hope`
2. Show account handle visible: "Replying as @women_cause"
3. Type reply: "Hello! This is a reply from @women_cause account. Testing two-way messaging."
4. Click "Send"
5. Show "✅ Message sent successfully!"
6. **Caption:** "Sending reply from Window 2"

**Window 1 (Left) - Receiving Reply:**
1. Wait 2-3 seconds (auto-refresh)
2. Show reply appearing automatically
3. Point to message bubble
4. Point to sender: "From @women_cause"
5. **Caption:** "Reply received in Window 1 - Two-way messaging demonstrated"

**Narration:**
> "Now I'm sending a reply from Window 2 using the @women_cause account. The reply appears automatically in Window 1, demonstrating complete two-way messaging functionality."

---

### PART 4: Native Instagram Client (3:30 - 4:30) ⚠️ CRITICAL

**This is the MOST IMPORTANT part for Meta reviewers!**

**Option A: Instagram Web in Browser (Recommended - Easier to Record):**

1. **Open Instagram Web in a new browser tab/window:**
   - Go to `instagram.com` in a new tab
   - Login as `@women_cause` account
   - Navigate to Messages

2. **Arrange windows:**
   - Window 1 (Left): Your app UI showing `@beher_hope`
   - Window 2 (Middle): Your app UI showing `@women_cause` (optional)
   - Browser Tab (Right): Instagram.com showing `@women_cause` messages

3. **Show the message:**
   - Point to Window 1: "Message sent from our app UI"
   - Point to Instagram.com tab: "Same message appearing in Instagram web client"
   - Show conversation with `@beher_hope`
   - Point to message bubble
   - Point to sender: "From @beher_hope"
   - Point to message text
   - Point to timestamp
   - **Caption:** "REQUIREMENT 3: Delivered Message in Native Instagram Client (Web)"

4. **Narration:**
   > "Here's the same message we sent from our app UI in Window 1, appearing in the Instagram web client. This proves that instagram_manage_messages permission allows us to send messages from our app UI that successfully appear in the recipient's Instagram account."

**Option B: Instagram Mobile App (Alternative - If Meta Specifically Requires Mobile):**

1. **Switch to Phone:**
   - Open Instagram app on phone
   - Navigate to `@women_cause` account's Messages
   - Find conversation with `@beher_hope`
   - **Show the message** that was sent from Window 1
   - Point to sender: "From @beher_hope"
   - Point to message text
   - Point to timestamp
   - **Caption:** "REQUIREMENT 3: Delivered Message in Native Instagram Client (Mobile App)"

**Recommendation:** Use **Option A (Instagram Web)** - it's easier to record, everything is on screen, and Instagram web is still an official Instagram client. If Meta specifically asks for mobile app, you can use Option B.

---

### PART 5: Summary (4:30 - 5:00)

**Show All Windows/Tabs:**
1. Pan across all screens:
   - Window 1: @beher_hope account visible
   - Window 2: @women_cause account visible (optional)
   - Instagram.com tab: Message in Instagram web client

2. **Emphasize:**
   - Asset selection: Both account handles visible
   - Live send action: Clicking send button in app UI
   - Delivered message: Appearing in Instagram web client

3. **Final Caption:**
   "All three requirements met: Asset selection, live send action, delivered message in Instagram client"

**Narration:**
> "To summarize: We've demonstrated all three requirements. Asset selection - both account handles @beher_hope and @women_cause are visible. Live send action - messages sent from our app UI. And delivered message - appearing in the Instagram web client. This proves instagram_manage_messages is working correctly."

---

## Key Points to Emphasize

### ✅ Asset Selection (REQUIREMENT 1):
- Account handle `@beher_hope` visible in Window 1
- Account handle `@women_cause` visible in Window 2
- Account IDs visible in both windows
- Account handles visible in conversation headers
- Account handles visible in send form labels

### ✅ Live Send Action (REQUIREMENT 2):
- Show typing in textarea
- Show clicking "Send" button
- Show "✅ Message sent successfully!" status
- Make sure click is visible and clear

### ✅ Delivered Message (REQUIREMENT 3):
- **MOST IMPORTANT:** Show message in native Instagram app on phone
- Point to sender name showing `@beher_hope`
- Point to message text
- Point to timestamp
- This is what Meta reviewers are looking for!

---

## Advantages of Two-Window Approach

✅ **Clear demonstration** - Easy to see both accounts
✅ **Professional** - Shows the app working with multiple accounts
✅ **Easy to follow** - Reviewers can see the flow clearly
✅ **Shows asset selection** - Both accounts visible simultaneously
✅ **Demonstrates functionality** - Two-way messaging clearly shown

---

## Tips for Recording

1. **Window Layout:**
   - Use split screen (50/50 or 60/40)
   - Make sure both windows are clearly visible
   - Use larger font sizes if needed

2. **Timing:**
   - Pause after each action
   - Wait for messages to appear (2-3 seconds)
   - Don't rush - reviewers need to see everything

3. **Captions:**
   - Add text overlays explaining each step
   - Label "Window 1" and "Window 2"
   - Highlight account handles with arrows/pointers

4. **Phone Screen:**
   - Make sure phone screen is clearly visible
   - Good lighting
   - Zoom in if needed to show message details

5. **Narration:**
   - Speak clearly and slowly
   - Explain what you're doing at each step
   - Emphasize the three requirements

---

## Checklist Before Recording

- [ ] Window 1: Can login with `reviewer@example.com`
- [ ] Window 1: Can see `@beher_hope` account
- [ ] Window 2: Can login with `womencause2@example.com`
- [ ] Window 2: Can see `@women_cause` account
- [ ] Can send message from Window 1 to Window 2
- [ ] Message appears in Window 2 automatically
- [ ] Can send reply from Window 2 to Window 1
- [ ] Reply appears in Window 1 automatically
- [ ] Instagram.com tab ready (logged in as `@women_cause`)
- [ ] Can see message in Instagram web client
- [ ] (Optional) Phone ready with Instagram app if using mobile demonstration
- [ ] Screen recording software ready
- [ ] Both windows visible in recording
- [ ] Audio is clear

---

**This is an excellent approach! The two-window setup makes it very clear and professional. Just make sure to show the native Instagram client (phone) for Requirement 3!**

