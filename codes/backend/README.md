# Campus Helper Platform - Backend API

A comprehensive backend API server for the Campus Helper Platform built with Node.js, Express, TypeScript, MongoDB, and Socket.io. This platform provides a complete solution for managing campus requests, announcements, user management, analytics, and more.

## 🚀 Features

- **🔐 Authentication & Authorization** - JWT-based authentication with role-based access control (Admin, Manager, Team, Student)
- **📋 Request Management** - Create, track, and manage service requests with categories and file attachments
- **📢 Announcements** - Targeted announcements with real-time delivery via Socket.io
- **🗺️ Campus Map** - Interactive map with markers for buildings and facilities
- **🤖 AI Chatbot** - AI-powered assistant using Google Gemini API
- **📊 Analytics** - Comprehensive analytics and statistics dashboard
- **👥 User Management** - Complete user profile and role management
- **📁 Category Management** - Dynamic category system for requests
- **⚙️ System Configuration** - Admin-configurable system settings
- **🔔 Real-time Updates** - Socket.io integration for live notifications and updates

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety and better developer experience
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **Google Gemini API** - AI chatbot integration
- **Multer** - File upload handling
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting middleware
- **Bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB (local installation or MongoDB Atlas)
- npm, yarn, or pnpm package manager
- Google Gemini API key (for AI chatbot feature)

## 🔧 Installation

1. **Clone the repository** (if applicable):
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create a `.env` file** in the backend directory:
```bash
cp .env.example .env
```

4. **Configure environment variables** in `.env`:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/campus-helper

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Google Gemini AI Configuration
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent
GEMINI_API_KEY=your-gemini-api-key-here

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# God User Configuration (REQUIRED for initial setup)
# These credentials will be used to create the first admin user via seeder
GOD_USER_EMAIL=admin@campus.edu
GOD_USER_USERNAME=admin
GOD_USER_PASSWORD=your-strong-password-here
GOD_USER_NAME=System Administrator
```

5. **Run database seeders** (optional but recommended):
```bash
# Create the initial admin user
npm run seed:god

# Seed default categories
npm run seed:categories

# Seed AI configuration
npm run seed:ai
```

6. **Start the development server**:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload (nodemon)
- `npm run build` - Build TypeScript to JavaScript for production
- `npm start` - Start production server (requires build first)
- `npm run type-check` - Type check without building
- `npm run seed:god` - Create initial admin user
- `npm run seed:categories` - Seed default request categories
- `npm run seed:ai` - Seed AI configuration

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files (database, env)
│   ├── middleware/          # Custom middleware (auth, error handling, rate limiting)
│   ├── modules/             # Feature modules
│   │   ├── ai/              # AI chatbot module
│   │   ├── analytics/       # Analytics and statistics
│   │   ├── announcement/    # Announcements system
│   │   ├── auth/            # Authentication module
│   │   ├── campusMap/       # Campus map markers
│   │   ├── category/        # Dynamic categories
│   │   ├── request/         # Service requests
│   │   ├── systemConfig/    # System configuration
│   │   └── user/            # User management
│   ├── routes/              # API route definitions
│   ├── seeders/             # Database seeders
│   ├── utils/               # Utility functions (socket, response helpers)
│   └── server.ts            # Application entry point
├── dist/                    # Compiled JavaScript (generated)
├── uploads/                 # Uploaded files directory
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/refresh` - Refresh access token

### Users (`/api/users`)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users` - Get all users (Admin/Manager only)
- `GET /api/users/:id` - Get user by ID (Admin/Manager only)
- `POST /api/users` - Create user (Admin/Manager only)
- `PUT /api/users/:id` - Update user (Admin/Manager only)
- `DELETE /api/users/:id` - Delete user (Admin/Manager only)

### Requests (`/api/requests`)
- `GET /api/requests` - Get all requests (filtered by role)
- `GET /api/requests/:id` - Get request by ID
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `PUT /api/requests/:id/status` - Update request status (Admin/Manager/Team)
- `DELETE /api/requests/:id` - Delete request (Admin/Manager/Team)
- `GET /api/requests/user/:userId` - Get user's requests
- `GET /api/requests/count` - Get request count

### Categories (`/api/categories`)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin/Manager)
- `PUT /api/categories/:id` - Update category (Admin/Manager)
- `DELETE /api/categories/:id` - Delete category (Admin/Manager)
- `PUT /api/categories/:id/activate` - Activate category (Admin/Manager)
- `PUT /api/categories/:id/deactivate` - Deactivate category (Admin/Manager)

### Announcements (`/api/announcements`)
- `GET /api/announcements/me` - Get user's announcements
- `GET /api/announcements/me/unread` - Get unread announcements
- `GET /api/announcements/me/unread-count` - Get unread count
- `PUT /api/announcements/me/read-all` - Mark all as read
- `PUT /api/announcements/:id/read` - Mark announcement as read
- `GET /api/announcements` - Get all announcements (Admin/Manager)
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create announcement (Admin/Manager)
- `DELETE /api/announcements/:id` - Delete announcement (Admin/Manager)

### Analytics (`/api/analytics`)
- `GET /api/analytics/statistics` - Get request statistics
- `GET /api/analytics/charts/category` - Get category chart data
- `GET /api/analytics/charts/status` - Get status chart data
- `GET /api/analytics/charts/daily` - Get daily chart data
- `GET /api/analytics/summary` - Get complete analytics summary

### Campus Map (`/api/campus-map`)
- `GET /api/campus-map` - Get all active markers
- `GET /api/campus-map/category/:category` - Get markers by category
- `GET /api/campus-map/:id` - Get marker by ID
- `GET /api/campus-map/admin/all` - Get all markers including inactive (Admin)
- `POST /api/campus-map` - Create marker (Admin)
- `PUT /api/campus-map/:id` - Update marker (Admin)
- `DELETE /api/campus-map/:id` - Delete marker (Admin)
- `GET /api/campus-map/admin/statistics` - Get marker statistics (Admin)

### AI Chatbot (`/api/ai`)
- `POST /api/ai/chat` - Send chat message
- `GET /api/ai/system-prompt` - Get system prompt (Admin)
- `PUT /api/ai/system-prompt` - Update system prompt (Admin)

### System Configuration (`/api/system-config`)
- `GET /api/system-config/public` - Get public system config (all users)
- `GET /api/system-config` - Get full system config (Admin)
- `PUT /api/system-config/name` - Update project name (Admin)
- `PUT /api/system-config/logo` - Update logo (Admin)
- `POST /api/system-config/email-domains` - Add email domain (Admin)
- `DELETE /api/system-config/email-domains` - Remove email domain (Admin)

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **Admin** - Full system access
- **Manager** - Can manage requests, categories, announcements, and users (except admins)
- **Team** - Can update request status and view requests
- **Student** - Can create and view their own requests

## 🔔 Real-time Features (Socket.io)

The API uses Socket.io for real-time communication:

### Events Emitted by Server:
- `request:created` - New request created
- `request:updated` - Request updated
- `request:deleted` - Request deleted
- `announcement:created` - New announcement created
- `announcement:deleted` - Announcement deleted

### Client Connection:
Connect to the Socket.io server and authenticate using your JWT token:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('request:created', (data) => {
  console.log('New request:', data);
});
```

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Multiple rate limiters for different endpoints:
  - `signinLimiter` - 10 requests/15min for sign-in
  - `apiLimiter` - 300 requests/15min for general API
  - `lenientLimiter` - 500 requests/15min for frequently accessed endpoints
  - `strictLimiter` - 50 requests/15min for write operations
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Request validation using express-validator
- **Password Hashing** - Bcryptjs for secure password storage
- **File Upload Security** - File type and size validation

## 📊 Rate Limiting

The API implements granular rate limiting:

- **Sign-in endpoints**: 10 requests per 15 minutes
- **General API endpoints**: 300 requests per 15 minutes
- **Frequently accessed endpoints** (categories, announcements, analytics): 500 requests per 15 minutes
- **Write operations** (create, update, delete): 50 requests per 15 minutes

## 📝 File Uploads

File uploads are handled using Multer:
- Maximum file size: 5MB (configurable)
- Supported file types: Images, PDFs, documents
- Upload path: `./uploads` (configurable)

## 🧪 Development

### Type Checking
```bash
npm run type-check
```

### Building for Production
```bash
npm run build
npm start
```

## 📚 Documentation

For detailed frontend integration documentation, refer to:
- User module integration
- Request module integration
- Announcement module integration
- Analytics module integration
- Campus Map module integration
- AI Chatbot module integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC

## 👥 Authors

Campus Helper Platform Team

## 🙏 Acknowledgments

- Express.js community
- MongoDB and Mongoose teams
- Socket.io team
- Google Gemini API

---

**Note**: Make sure to change all default secrets and API keys in production environments!
