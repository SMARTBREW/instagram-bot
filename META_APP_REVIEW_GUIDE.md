# 📋 Meta App Review Resubmission Guide

## Why Your Submission Was Rejected

Your app was rejected because:
1. **Screencast didn't show end-to-end experience** - Meta reviewers need to see the complete flow
2. **Missing server-to-server indication** - You didn't specify that this is a backend API using Page Access Tokens

## ✅ What You Need to Do

### 1. Update Submission Notes

**CRITICAL:** Add this statement to your submission notes:

```
IMPORTANT: This is a server-to-server application using Page Access Tokens.

Our application is a backend API that:
- Uses Page Access Tokens (obtained via Meta Business Manager) to access Instagram API
- Does NOT have a frontend Meta login authentication flow
- Receives messages via webhooks and sends messages via Graph API
- Page Access Tokens are configured server-side by administrators

The screencast demonstrates the functionality using a pre-configured Page Access Token.
```

### 2. Create a New Screencast

Your screencast must show:

#### Part 1: Account Setup (30-60 seconds)
- Show Meta Business Manager or Developer Portal
- Explain that Page Access Token is obtained from Meta Business Manager
- Show how the Instagram Business Account is connected to your app
- **Add captions:** "Step 1: Page Access Token obtained from Meta Business Manager"

#### Part 2: Use Case Demonstration - Receiving Messages (60-90 seconds)
- Show your webhook endpoint receiving messages
- Send a test message from Instagram to your business account
- Show the message appearing in your system (via API response or database)
- **Add captions:** 
  - "Step 2: User sends message to Instagram Business Account"
  - "Step 3: Webhook receives message via instagram_manage_messages permission"
  - "Step 4: Message stored in system"

#### Part 3: Use Case Demonstration - Sending Messages (60-90 seconds)
- Show your API sending a message via Graph API
- Show the message appearing in Instagram
- **Add captions:**
  - "Step 5: System sends reply using instagram_manage_messages permission"
  - "Step 6: Message delivered to user in Instagram"

#### Part 4: Instagram Basic Permission Usage (30-60 seconds)
- Show fetching user profile/username using `instagram_basic` permission
- Show API call and response
- **Add captions:** "Using instagram_basic permission to fetch user profile data"

### 3. Screencast Best Practices

✅ **DO:**
- Use English for all UI elements and narration
- Add text captions explaining each step
- Use tooltips/arrows to highlight important buttons
- Show actual API responses or database records
- Keep total length under 5 minutes
- Show real functionality, not mockups

❌ **DON'T:**
- Skip steps in the flow
- Use non-English UI
- Show only code without actual execution
- Make it too long (reviewers have limited time)

### 4. Submission Notes Template

Use this structure for your submission notes:

```
## Use Case Description

Our application is a server-to-server Instagram messaging automation tool that:

1. Receives Instagram Direct Messages via webhooks
2. Stores messages in our database
3. Allows administrators to view and respond to messages via API
4. Sends automated or manual replies to users

## Technical Architecture

- **Type:** Server-to-server application
- **Authentication:** Page Access Tokens (obtained via Meta Business Manager)
- **No Frontend Meta Login:** This app does not have a user-facing Meta login flow
- **Token Management:** Page Access Tokens are configured server-side by administrators

## Permissions Requested

### instagram_basic
**Usage:** Fetch user profile information (username, name) when receiving messages via webhook
**Why needed:** To display sender information in our messaging dashboard

### instagram_manage_messages
**Usage:** 
- Receive incoming messages via webhooks
- Send replies to users via Graph API
**Why needed:** Core functionality for Instagram messaging automation

## Screencast Notes

The screencast demonstrates:
1. Webhook receiving a message (instagram_manage_messages)
2. Fetching user profile (instagram_basic)
3. Sending a reply message (instagram_manage_messages)

Note: Page Access Token was pre-configured as this is a server-to-server app.
```

## 📹 Screencast Recording Tips

### Tools
- **macOS:** QuickTime Player (built-in) or ScreenFlow
- **Windows:** OBS Studio or Camtasia
- **Online:** Loom, Screencastify

### Recording Settings
- Resolution: 1920x1080 or higher
- Frame rate: 30fps minimum
- Audio: Clear narration or captions
- Format: MP4 (H.264)

### Editing
- Add text captions for each step
- Highlight important UI elements with arrows/circles
- Add transitions between steps
- Keep it concise (3-5 minutes total)

## 🔍 What Meta Reviewers Are Looking For

1. **Complete Flow:** Can they see the permission being used end-to-end?
2. **Real Usage:** Is this a real use case or just testing?
3. **User Benefit:** Does this help users manage their Instagram messages?
4. **Compliance:** Does it follow Meta's policies?

## ✅ Checklist Before Resubmitting

- [ ] Added "server-to-server app" statement in submission notes
- [ ] Screencast shows complete end-to-end flow
- [ ] Screencast includes captions explaining each step
- [ ] Screencast demonstrates both permissions being used
- [ ] Screencast is in English
- [ ] Submission notes clearly explain use case
- [ ] Submission notes explain why each permission is needed
- [ ] Tested that permissions actually work in your app

## 📝 Example Screencast Script

```
[0:00-0:30] Introduction
"This screencast demonstrates our Instagram messaging automation tool.
This is a server-to-server application using Page Access Tokens."

[0:30-1:30] Receiving Messages
"First, let's show how we receive messages. I'll send a test message
from Instagram. [Send message] Now you can see the webhook received
the message using the instagram_manage_messages permission. The message
is stored in our database."

[1:30-2:00] Fetching User Profile
"Next, we fetch the user's profile using the instagram_basic permission
to get their username. [Show API call] Here's the response with the
username."

[2:00-3:00] Sending Reply
"Finally, we send a reply using the instagram_manage_messages permission.
[Show API call] And you can see the message appears in Instagram."

[3:00-3:30] Conclusion
"This demonstrates our complete messaging workflow using both requested
permissions."
```

## 🆘 Common Issues

### Issue: "Screencast doesn't show Meta login"
**Solution:** Add statement that it's server-to-server, no frontend login

### Issue: "Can't see permission being used"
**Solution:** Show actual API calls with responses, highlight permission in logs

### Issue: "Use case unclear"
**Solution:** Add more captions explaining what's happening and why

## 📚 Resources

- [Meta App Review Guide](https://developers.facebook.com/docs/app-review)
- [Screen Recording Guide](https://developers.facebook.com/docs/app-review/guides/screen-recording)
- [Permissions Reference](https://developers.facebook.com/docs/permissions/reference)
- [Common Rejection Reasons](https://developers.facebook.com/docs/app-review/rejection-guidelines)

---

**Remember:** Meta reviewers approve thousands of apps. Make it easy for them to understand your use case by being clear, complete, and following their guidelines.

