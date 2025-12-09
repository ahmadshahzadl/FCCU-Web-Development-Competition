# 🎓 Campus Helper Platform

A comprehensive web-based solution designed to centralize campus services, requests, and information for university students.

## 📋 Overview

The Campus Helper Platform streamlines communication between students and administration, providing an efficient system for managing campus-related issues, tracking service requests, and accessing essential campus resources.

## ✨ Features

- 🎫 **Service Request System** - Submit and track campus service requests
- 📊 **Admin Dashboard** - Manage and monitor all service requests
- 🗺️ **Campus Map** - Interactive map with key campus locations
- 📢 **Announcements Board** - Stay updated with campus news and notices
- 💬 **Real-time Chat** - Communicate with administrators about requests
- 📈 **Analytics Dashboard** - View request statistics and trends
- 🤖 **AI Campus Assistant** - Get instant answers to campus questions
- 🔔 **Real-time Notifications** - Stay informed about request updates

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library for building user interfaces
- **TypeScript** - Type-safe JavaScript for better code quality
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router v6** - Client-side routing and navigation
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time bidirectional communication
- **React Leaflet** - Interactive map library wrapper
- **Leaflet** - Open-source JavaScript library for mobile-friendly interactive maps
- **Recharts** - Composable charting library for data visualization
- **Chart.js** - Simple yet flexible charting library
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling library
- **Socket.io** - Real-time bidirectional communication
- **JWT (JSON Web Tokens)** - Authentication and authorization
- **Google Gemini API** - AI-powered chatbot integration
- **Multer** - File upload handling middleware
- **Helmet.js** - Security headers middleware
- **Express Rate Limit** - Rate limiting middleware
- **Bcryptjs** - Password hashing library
- **Express Validator** - Input validation middleware

### Database
- **MongoDB** - Document-based NoSQL database
  - Collections: users, requests, announcements, categories, campusMap, systemConfig, aiConfig
  - Mongoose ODM for schema design and validation
  - Indexing for performance optimization

### Development Tools
- **ESLint** - Code linting and quality checks
- **Nodemon** - Development server auto-reload
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm/yarn/pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/fccu-web-competition.git
   cd fccu-web-competition
   ```

2. **Install dependencies:**
   ```bash
   # Frontend
   cd codes/frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Frontend - codes/frontend/.env
   VITE_API_URL=http://localhost:3000
   VITE_SOCKET_URL=http://localhost:3000
   
   # Backend - codes/backend/.env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/campus-helper
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run development servers:**
   ```bash
   # Frontend (Terminal 1)
   cd codes/frontend
   npm run dev
   
   # Backend (Terminal 2)
   cd codes/backend
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🔌 APIs Used

### External APIs

1. **Google Gemini API**
   - **Purpose**: AI-powered campus assistant chatbot
   - **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`
   - **Usage**: Provides context-aware responses to campus-related queries
   - **Configuration**: System prompt can be customized by admin users

2. **OpenStreetMap (via Leaflet)**
   - **Purpose**: Interactive campus map tiles
   - **Usage**: Free map tiles for displaying campus locations
   - **No API Key Required**: OpenStreetMap is free and open-source

### Internal APIs (REST Endpoints)

The platform provides a comprehensive REST API with the following modules:

#### Authentication (`/api/auth`)
- User sign in, sign up, and token refresh
- JWT-based authentication

#### Users (`/api/users`)
- User profile management
- User CRUD operations (Admin/Manager)
- Role-based access control

#### Requests (`/api/requests`)
- Service request creation and management
- Status updates and tracking
- File attachments support
- Role-based filtering

#### Categories (`/api/categories`)
- Dynamic category management
- Category activation/deactivation
- Icon and description management

#### Announcements (`/api/announcements`)
- Announcement creation and management
- Targeted announcements
- Unread count tracking
- Real-time delivery

#### Analytics (`/api/analytics`)
- Request statistics and trends
- Category and status breakdowns
- Daily request charts
- Comprehensive analytics summary

#### Campus Map (`/api/campus-map`)
- Marker CRUD operations
- Category-based filtering
- Marker statistics

#### AI Chatbot (`/api/ai`)
- Chat message processing
- System prompt management

#### System Configuration (`/api/system-config`)
- Project name and logo management
- Email domain whitelist
- Public configuration access

### Real-time Communication (Socket.io)

**Socket.io Events:**
- `request:created` - New request created
- `request:updated` - Request status/fields updated
- `request:deleted` - Request deleted
- `announcement:created` - New announcement published
- `announcement:deleted` - Announcement removed

**Connection:**
- WebSocket-based real-time communication
- JWT authentication for socket connections
- Automatic reconnection handling
- Role-based event filtering

## 🔄 System Flow Overview

### 1. User Authentication Flow
```
User → Login Page → Backend Auth API → JWT Token → Local Storage → Protected Routes
```

1. User enters credentials on login page
2. Frontend sends request to `/api/auth/signin`
3. Backend validates credentials and generates JWT token
4. Token stored in localStorage and used for subsequent requests
5. User redirected to appropriate dashboard based on role

### 2. Service Request Flow
```
Student → Submit Request Form → Backend API → MongoDB → Socket.io Event → Real-time Update → Admin Dashboard
```

1. Student fills out request form with category, description, and optional attachment
2. Frontend sends POST request to `/api/requests`
3. Backend validates, processes file upload (if any), and saves to MongoDB
4. Socket.io emits `request:created` event
5. Admin/Manager dashboards receive real-time notification
6. Request appears in management dashboard

### 3. Request Management Flow
```
Admin/Manager → Dashboard → View Requests → Update Status → Backend API → MongoDB → Socket.io → Student Notification
```

1. Admin/Manager views requests in dashboard
2. Filters and searches requests by status, category, or student
3. Updates request status (Pending → In Progress → Resolved)
4. Backend updates MongoDB and emits `request:updated` event
5. Student receives real-time notification of status change
6. Request history updated for student

### 4. Real-time Notification Flow
```
Backend Event → Socket.io Server → Authenticated Clients → Frontend Socket Hook → Toast Notification → UI Update
```

1. Backend action triggers event (request update, new announcement, etc.)
2. Socket.io server emits event to connected clients
3. Frontend socket hooks listen for events
4. Toast notification displayed to user
5. UI components update automatically (request list, announcement count, etc.)

### 5. AI Chatbot Flow
```
User → Chat Input → Frontend → Backend API → Google Gemini API → AI Response → Frontend Display
```

1. User types question in chatbot interface
2. Frontend sends message to `/api/ai/chat`
3. Backend retrieves system prompt from database
4. Backend calls Google Gemini API with user message and system context
5. AI generates campus-specific response
6. Response displayed in chat interface

### 6. Campus Map Flow
```
User → Map Page → Frontend → Backend API → MongoDB → Marker Data → Leaflet Map → Interactive Display
```

1. User navigates to campus map page
2. Frontend requests markers from `/api/campus-map`
3. Backend queries MongoDB for active markers
4. Marker data returned with coordinates, category, and details
5. React Leaflet renders markers on OpenStreetMap tiles
6. User can filter by category and view marker details

### 7. Analytics Flow
```
Admin/Manager → Analytics Dashboard → Frontend → Backend API → MongoDB Aggregation → Chart Data → Visualization
```

1. Admin/Manager navigates to analytics dashboard
2. Frontend requests analytics data from `/api/analytics`
3. Backend performs MongoDB aggregation queries
4. Calculates statistics (totals, trends, category breakdowns)
5. Data formatted for chart libraries (Recharts/Chart.js)
6. Visualizations rendered on dashboard

### 8. Announcement Flow
```
Admin/Manager → Create Announcement → Backend API → MongoDB → Socket.io Event → All Users → Real-time Display
```

1. Admin/Manager creates announcement with type, priority, and target audience
2. Backend saves to MongoDB
3. Socket.io emits `announcement:created` event
4. All connected users receive notification
5. Announcement appears in announcements page
6. Unread count badge updates in real-time

### Overall Architecture Flow
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ◄─────► │   Backend    │ ◄─────► │   MongoDB   │
│  (React)    │  REST   │  (Express)   │  ODM    │  (Database) │
└─────────────┘         └──────────────┘         └─────────────┘
       │                       │
       │                       │
       │ Socket.io             │ Socket.io
       │                       │
       ▼                       ▼
┌─────────────┐         ┌──────────────┐
│   Socket.io │ ◄─────► │ Google Gemini│
│   Client    │  Events │     API      │
└─────────────┘         └──────────────┘
```

**Key Components:**
- **Frontend**: React SPA with client-side routing
- **Backend**: Express.js REST API with Socket.io
- **Database**: MongoDB for data persistence
- **Real-time**: Socket.io for live updates
- **AI**: Google Gemini API for chatbot
- **Maps**: Leaflet with OpenStreetMap tiles

## 📁 Project Structure

```
fccu-web-competition/
├── codes/
│   ├── frontend/          # React frontend application
│   └── backend/           # Node.js backend API
├── docs/                  # Project documentation
├── COMMIT_GUIDELINES.md   # Commit message guidelines
├── CONTRIBUTING.md        # Contribution guidelines
└── README.md              # This file
```

## 📚 Documentation

- [Frontend Setup Guide](codes/frontend/README.md)
- [Commit Guidelines](COMMIT_GUIDELINES.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Quick Commit Reference](COMMIT_QUICK_REFERENCE.md)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and [Commit Guidelines](COMMIT_GUIDELINES.md) before submitting pull requests.

### Quick Commit Guide

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
<type>(<scope>): <subject>

# Examples:
feat(requests): add file upload functionality
fix(dashboard): resolve status update issue
docs(readme): update installation steps
```

See [COMMIT_QUICK_REFERENCE.md](COMMIT_QUICK_REFERENCE.md) for a quick cheat sheet.

## 📝 Commit Message Setup

To use the commit message template:

```bash
git config commit.template .gitmessage
```

## 🧪 Development

### Frontend
```bash
cd codes/frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
```

### Backend
```bash
cd codes/backend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
npm test         # Run tests
```

## 📄 License

MIT

## 👥 Contributors

Thank you to all contributors who help improve this project!

---

For detailed documentation, see the [docs](docs/) folder.


