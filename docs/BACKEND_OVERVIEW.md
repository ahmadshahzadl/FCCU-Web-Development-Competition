# Backend Overview - Campus Helper Platform

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Module Structure](#module-structure)
3. [Technology Stack](#technology-stack)
4. [Request Flow](#request-flow)
5. [Authentication Flow](#authentication-flow)
6. [Real-time Communication](#real-time-communication)

---

## 🏗️ Architecture

The backend follows a **modular architecture** pattern with clear separation of concerns:

```
Backend Architecture:
┌─────────────────────────────────────────────────────────┐
│                    Express Server                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Middleware  │  │    Routes    │  │  Controllers │ │
│  │  - Auth      │  │  - /api/auth │  │  - Auth      │ │
│  │  - Error     │  │  - /api/users│  │  - Users     │ │
│  │  - Upload    │  │  - /api/reqs │  │  - Requests  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                          │                             │
│                    ┌─────▼─────┐                       │
│                    │  Services │                       │
│                    │  - Business│                      │
│                    │    Logic  │                       │
│                    └─────┬─────┘                       │
│                          │                             │
│                    ┌─────▼─────┐                       │
│                    │  Models   │                       │
│                    │  Mongoose │                       │
│                    └─────┬─────┘                       │
└──────────────────────────┼─────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   MongoDB   │
                    │  Database   │
                    └─────────────┘
```

### Layer Responsibilities

1. **Routes Layer**: Define API endpoints and HTTP methods
2. **Controller Layer**: Handle HTTP requests/responses, validate input
3. **Service Layer**: Business logic, data processing, external API calls
4. **Model Layer**: Database schema definitions, data validation
5. **Middleware Layer**: Authentication, error handling, file uploads

---

## 📦 Module Structure

Each module follows a consistent structure:

```
module-name/
├── Module.controller.ts    # HTTP request handlers
├── Module.service.ts       # Business logic
├── Module.model.ts         # Database schema (if needed)
├── Module.routes.ts        # Route definitions
├── Module.validation.ts    # Input validation (if needed)
└── index.ts                # Module exports
```

### Module Pattern

```typescript
// Routes define endpoints
router.get('/endpoint', controller.method);

// Controllers handle HTTP
controller.method = async (req, res, next) => {
  // Validate input
  // Call service
  // Return response
};

// Services contain business logic
service.method = async (data) => {
  // Process data
  // Interact with database
  // Return result
};
```

---

## 🛠️ Technology Stack

### Core Technologies
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **MongoDB**: Database
- **Mongoose**: ODM (Object Document Mapper)

### Key Libraries
- **Socket.io**: Real-time communication
- **JWT**: Authentication tokens
- **Multer**: File uploads
- **Helmet**: Security headers
- **Express Rate Limit**: Rate limiting
- **Bcryptjs**: Password hashing
- **Express Validator**: Input validation

---

## 🔄 Request Flow

### Standard API Request Flow

```
1. Client Request
   ↓
2. Express Middleware
   ├─ CORS
   ├─ Helmet (Security)
   ├─ Rate Limiting
   └─ Body Parser
   ↓
3. Route Handler
   ├─ Extract route params
   └─ Call controller
   ↓
4. Controller
   ├─ Validate input (if needed)
   ├─ Extract user from JWT (if protected)
   └─ Call service method
   ↓
5. Service
   ├─ Business logic
   ├─ Database operations (via Model)
   ├─ External API calls (if needed)
   └─ Return data
   ↓
6. Controller Response
   ├─ Format response
   └─ Send to client
   ↓
7. Error Handler (if error)
   ├─ Catch errors
   ├─ Format error response
   └─ Send error to client
```

### Example: Creating a Request

```typescript
// 1. Client sends POST /api/requests
POST /api/requests
Headers: { Authorization: "Bearer <token>" }
Body: { category, description, attachment }

// 2. Route matches
Request.routes.ts → router.post('/', controller.create)

// 3. Controller handles
Request.controller.create(req, res, next) {
  - Extract user from JWT token
  - Validate request body
  - Call Request.service.create()
}

// 4. Service processes
Request.service.create(data, userId) {
  - Process file upload (if any)
  - Create request document
  - Save to MongoDB
  - Emit Socket.io event
  - Return created request
}

// 5. Response sent
Response: { success: true, data: request }
```

---

## 🔐 Authentication Flow

### JWT-Based Authentication

```
1. User Login
   POST /api/auth/signin
   Body: { email, password }
   ↓
2. Auth Service
   - Validate credentials
   - Check password hash
   - Generate JWT token
   ↓
3. Response
   { token, user }
   ↓
4. Client stores token
   localStorage.setItem('token', token)
   ↓
5. Subsequent Requests
   Headers: { Authorization: "Bearer <token>" }
   ↓
6. Auth Middleware
   - Extract token
   - Verify token
   - Attach user to request
   ↓
7. Protected Route
   - Access req.user
   - Proceed with request
```

### Token Structure

```typescript
JWT Payload: {
  userId: string,
  email: string,
  role: 'admin' | 'manager' | 'team' | 'student',
  iat: number,  // Issued at
  exp: number   // Expiration
}
```

### Role-Based Access Control (RBAC)

```typescript
// Middleware checks user role
const requireRole = (roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Usage
router.post('/users', 
  authMiddleware, 
  requireRole(['admin', 'manager']), 
  controller.create
);
```

---

## 🔔 Real-time Communication

### Socket.io Integration

```
1. Client Connection
   socket.io-client connects to server
   ↓
2. Authentication
   Client sends JWT token in auth
   ↓
3. Server Verification
   - Verify JWT token
   - Extract user info
   - Join user to role-based rooms
   ↓
4. Event Emission
   Server emits events based on actions
   ↓
5. Client Reception
   Client listens for events
   ↓
6. UI Update
   Frontend updates UI in real-time
```

### Socket Events

**Server Emits:**
- `request:created` - New request created
- `request:updated` - Request status/fields updated
- `request:deleted` - Request deleted
- `announcement:created` - New announcement
- `announcement:deleted` - Announcement removed

**Client Listens:**
```typescript
socket.on('request:created', (data) => {
  // Update request list
  // Show notification
  // Refresh dashboard
});
```

### Room-Based Broadcasting

```typescript
// Users join role-based rooms
socket.join(`role:${user.role}`);
socket.join(`user:${user.id}`);

// Emit to specific rooms
io.to('role:admin').emit('request:created', data);
io.to(`user:${userId}`).emit('request:updated', data);
```

---

## 📊 Database Schema Overview

### Collections

1. **users** - User accounts and profiles
2. **requests** - Service requests
3. **announcements** - Campus announcements
4. **categories** - Request categories
5. **campusMap** - Map markers
6. **systemConfig** - System configuration
7. **aiConfig** - AI chatbot configuration

### Relationships

```
User (1) ──→ (Many) Requests
User (1) ──→ (Many) Announcements (creator)
Category (1) ──→ (Many) Requests
Request (Many) ──→ (1) Category
```

---

## 🔒 Security Features

### 1. Authentication
- JWT tokens with expiration
- Password hashing with bcrypt
- Token refresh mechanism

### 2. Authorization
- Role-based access control
- Route-level permissions
- Resource-level ownership checks

### 3. Input Validation
- Express Validator
- Schema validation
- File type/size validation

### 4. Rate Limiting
- Sign-in: 10 requests/15min
- General API: 300 requests/15min
- Write operations: 50 requests/15min

### 5. Security Headers
- Helmet.js for security headers
- CORS configuration
- XSS protection

---

## 📝 Error Handling

### Error Response Format

```typescript
{
  success: false,
  error: {
    message: "Error message",
    code: "ERROR_CODE",
    details: {} // Optional
  }
}
```

### Error Types

1. **Validation Errors** (400) - Invalid input
2. **Authentication Errors** (401) - Unauthorized
3. **Authorization Errors** (403) - Forbidden
4. **Not Found Errors** (404) - Resource not found
5. **Server Errors** (500) - Internal server error

### Error Middleware

```typescript
app.use((err, req, res, next) => {
  // Log error
  // Format error response
  // Send to client
});
```

---

## 🚀 Next Steps

- [Module Documentation](./BACKEND_MODULES.md) - Detailed module documentation
- [API Reference](./BACKEND_API.md) - Complete API endpoint reference
- [Database Schema](./BACKEND_DATABASE.md) - Database models and schemas

