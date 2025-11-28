# Instagram DM Automation Backend

Backend system that connects with Meta's Instagram Messaging API to manage Instagram DMs, conversations, and automate responses.

## Features

- ✅ Backend skeleton with Express + Mongoose
- ✅ Authentication system (JWT-based)
- ✅ Instagram account connection management
- ✅ Meta webhook integration
- ✅ Message & conversation storage
- ✅ Send Instagram DMs via API
- ✅ Multi-account support
- ✅ Logging system
- 🔄 Auto-reply automation (future enhancement)

## Tech Stack

- **Node.js** (>=12.0.0)
- **Express** (^4.18.3)
- **MongoDB/Mongoose** (^8.1.1)
- **Passport.js** (^0.7.0) with JWT strategy
- **Winston** (logging)
- **Joi** (validation)

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── index.js              # Entry point
├── config/               # Configuration files
│   ├── config.js        # Environment variables
│   ├── logger.js        # Winston logger
│   ├── morgan.js        # HTTP request logger
│   ├── passport.js      # Passport JWT strategy
│   └── roles.js         # RBAC roles
├── controllers/          # Request handlers
├── routes/v1/           # API routes (versioned)
├── models/              # Mongoose models
├── services/            # Business logic
├── middlewares/         # Express middlewares
│   ├── auth.js         # JWT authentication
│   ├── validate.js     # Joi validation
│   ├── error.js        # Error handling
│   └── rateLimiter.js  # Rate limiting
├── validations/         # Joi validation schemas
├── utils/               # Utility functions
│   ├── ApiError.js     # Custom error class
│   ├── catchAsync.js   # Async error wrapper
│   └── pick.js         # Object property picker
└── helpers/             # Helper functions

```

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017/instagram-dm-automation
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30

# Meta Instagram API (get these from Meta Developer Portal)
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
META_VERIFY_TOKEN=your-webhook-verify-token
META_API_VERSION=v21.0
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS with Homebrew
brew services start mongodb-community

# or run directly
mongod
```

### 4. Run the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

### 5. Test Health Check

```bash
curl http://localhost:3000/health-check
# Response: OK
```

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm test` - Run tests with Jest
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix linting issues
- `npm run prettier` - Check formatting
- `npm run prettier:fix` - Fix formatting

## API Endpoints

### Authentication ✅
- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - Login user
- `POST /v1/auth/logout` - Logout user
- `POST /v1/auth/refresh-tokens` - Refresh auth tokens
- `POST /v1/auth/forgot-password` - Send reset password email
- `POST /v1/auth/reset-password` - Reset password
- `POST /v1/auth/verify-email` - Verify email

### Instagram Accounts ✅
- `POST /v1/instagram` - Connect Instagram account
- `GET /v1/instagram` - List connected accounts
- `GET /v1/instagram/:accountId` - Get account details
- `PATCH /v1/instagram/:accountId` - Update account
- `DELETE /v1/instagram/:accountId` - Remove account (soft delete)

### Conversations ✅
- `GET /v1/conversations/:accountId` - Get conversations for an Instagram account
- `GET /v1/conversations/detail/:conversationId` - Get conversation details
- `DELETE /v1/conversations/detail/:conversationId` - Delete conversation (soft delete)

### Messages ✅
- `GET /v1/messages/:conversationId` - Get messages for a conversation
- `POST /v1/messages/:conversationId` - Send message (text or attachment)
- `POST /v1/messages/:conversationId/read` - Mark messages as read

### Webhook ✅
- `GET /v1/webhook` - Meta verification endpoint
- `POST /v1/webhook` - Receive webhook events (messages, reactions, reads)

## Development Guidelines

This project follows strict coding standards defined in `PROJECT_RULES.md`. Key points:

- **File Naming**: `*.controller.js`, `*.service.js`, `*.model.js`, etc.
- **Error Handling**: Always use `catchAsync` wrapper and `ApiError` class
- **Validation**: Use Joi schemas in middleware
- **Authentication**: JWT-based with role-based access control
- **Response Format**: Consistent structure with proper HTTP status codes

## Project Status

✅ **Core Features Complete**

1. ✅ Backend skeleton setup
2. ✅ Authentication system (User & Token models)
3. ✅ Instagram account connection
4. ✅ Webhook handlers (receive messages)
5. ✅ Message & conversation storage
6. ✅ Send message API (text & attachments)

🔄 **Future Enhancements**

- Auto-reply rules (keyword triggers)
- Message templates
- Scheduled messages
- Analytics dashboard
- Multi-agent support
- Message search & filtering

## Testing Instagram Account Connection

After logging in and getting an access token, you can connect an Instagram Business account:

### Connect Instagram Account
```bash
curl -X POST http://localhost:3000/v1/instagram \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "pageId": "YOUR_PAGE_ID",
    "instagramBusinessId": "YOUR_IG_BUSINESS_ID",
    "pageAccessToken": "YOUR_PAGE_ACCESS_TOKEN",
    "username": "your_instagram_username",
    "followersCount": 1000
  }'
```

### List Connected Accounts
```bash
curl -X GET http://localhost:3000/v1/instagram \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Note**: To get your Page ID, Instagram Business ID, and Page Access Token, you need to:
1. Create a Meta App in the [Meta Developer Portal](https://developers.facebook.com/)
2. Add Instagram Messaging product
3. Connect your Instagram Business account
4. Get the required credentials from the App Dashboard

## Setting Up Meta Webhook

After deploying your backend, configure the webhook in Meta Developer Portal:

1. Go to your Meta App → Instagram → Messenger API Settings
2. Set Webhook URL: `https://your-domain.com/v1/webhook`
3. Set Verify Token: Same as `META_VERIFY_TOKEN` in your `.env`
4. Subscribe to webhook fields:
   - `messages`
   - `messaging_postbacks`
   - `message_reactions`
   - `message_reads`

### Testing Webhook Locally

Use a tool like [ngrok](https://ngrok.com/) to expose your local server:

```bash
# Start your server
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Use the ngrok URL in Meta webhook settings
# Example: https://abc123.ngrok.io/v1/webhook
```

## Retrieving Conversations & Messages

### Get Conversations
```bash
curl -X GET http://localhost:3000/v1/conversations/:accountId \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Messages for a Conversation
```bash
curl -X GET http://localhost:3000/v1/messages/:conversationId \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mark Messages as Read
```bash
curl -X POST http://localhost:3000/v1/messages/:conversationId/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Send a Message
```bash
# Send text message
curl -X POST http://localhost:3000/v1/messages/:conversationId \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "text": "Hello! How can I help you today?"
  }'

# Send image attachment
curl -X POST http://localhost:3000/v1/messages/:conversationId \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "attachment": {
      "type": "image",
      "url": "https://example.com/image.jpg"
    }
  }'
```

**Supported attachment types**: `image`, `video`, `audio`, `file`

## Testing the Authentication System

After running `npm install` and starting the server with `npm run dev`, you can test the auth endpoints:

### Register a new user
```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response will include access and refresh tokens:
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "tokens": {
    "access": {
      "token": "eyJhbGc...",
      "expires": "2024-01-01T12:30:00.000Z"
    },
    "refresh": {
      "token": "eyJhbGc...",
      "expires": "2024-01-31T12:00:00.000Z"
    }
  }
}
```

## License

ISC

