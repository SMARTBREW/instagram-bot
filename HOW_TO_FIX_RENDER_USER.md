# 🔧 How to Fix User Login in Render Database

## Problem
Render uses a **different MongoDB database** than your local environment. Scripts run locally connect to your local MongoDB, but Render's API connects to Render's MongoDB.

## Solution: Use the New User

A new user has been created in **Render's database** via the API:

### ✅ New User Credentials (Works in Render):
- **Email:** `womencause2@example.com`
- **Password:** `WomenCause123`

This user was created directly in Render's database, so login will work!

## Next Step: Link Instagram Account

The Instagram account needs to be linked to this user in **Render's database**. You have two options:

### Option 1: Get Render's MongoDB Connection String

1. Go to **Render Dashboard** → Your Service → **Environment**
2. Find `MONGODB_URL` environment variable
3. Copy the connection string
4. Run this command:

```bash
RENDER_MONGODB_URL="<paste-render-mongodb-url-here>" node scripts/link-account-to-new-user.js
```

### Option 2: Use API to Create Instagram Account

If there's an API endpoint to create Instagram accounts, use that instead.

### Option 3: Manual Database Update

Connect to Render's MongoDB directly and run:
```javascript
db.instagramaccounts.updateOne(
  { instagramBusinessId: "17841474994620118" },
  { $set: { user: ObjectId("6940f19c354ed918c0ee2039") } }
)
```

## Quick Test

Try logging in with the new credentials:
- **Email:** `womencause2@example.com`
- **Password:** `WomenCause123`

If login works but you don't see the Instagram account, you need to link it using one of the options above.

---

**For now, use `womencause2@example.com` / `WomenCause123` - this user exists in Render's database!**

