# Campus Helper Platform - Backend

Backend API server for the Campus Helper Platform built with Node.js, Express, TypeScript, MongoDB, and Socket.io.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB (local or Atlas)
- npm, yarn, or pnpm package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory (copy from `.env.example`):
```bash
cp .env.example .env
```

Then update the `.env` file with your actual values:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campus-helper
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key_here
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# God User Configuration (REQUIRED)
# These credentials will be used to create the first admin user via seeder
# IMPORTANT: Use strong, unique credentials!
GOD_USER_EMAIL=your-god-user-email@example.com
GOD_USER_USERNAME=your-god-username
GOD_USER_PASSWORD=your-strong-password-here
GOD_USER_NAME=God Admin
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - Type check without building

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.ts        # Entry point
├── dist/                # Compiled JavaScript
├── uploads/             # Uploaded files
├── package.json
├── tsconfig.json
└── .env
```

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **OpenAI API** - AI chatbot integration
- **Multer** - File upload handling
- **JWT** - Authentication

## 📚 Module Documentation

- [Module Documentation](./docs/MODULE_DOCUMENTATION.md) - Complete documentation for all modules
- **bcryptjs** - Password hashing

## 📝 API Endpoints

### Service Requests
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get request by ID
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `PUT /api/requests/:id/status` - Update request status
- `DELETE /api/requests/:id` - Delete request
- `GET /api/requests/user/:userId` - Get user's requests

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get announcement by ID

### Chat
- `GET /api/chat/:requestId` - Get chat messages
- `POST /api/chat/:requestId/message` - Send message
- `GET /api/chat/user/:userId` - Get user's chats

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/category` - Get category statistics
- `GET /api/analytics/trends` - Get trend data

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

## 🔒 Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT authentication
- Input validation

## 📄 License

ISC

