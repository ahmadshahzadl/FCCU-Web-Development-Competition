# Backend Modules Documentation

## 📋 Table of Contents

1. [Authentication Module](#authentication-module)
2. [User Module](#user-module)
3. [Request Module](#request-module)
4. [Category Module](#category-module)
5. [Announcement Module](#announcement-module)
6. [Analytics Module](#analytics-module)
7. [Campus Map Module](#campus-map-module)
8. [AI Module](#ai-module)
9. [System Config Module](#system-config-module)

---

## 🔐 Authentication Module

### Overview
Handles user authentication, JWT token generation, and user sign-in/sign-up.

### Files
- `Auth.controller.ts` - HTTP request handlers
- `Auth.service.ts` - Business logic for authentication
- `Auth.routes.ts` - Route definitions
- `Auth.validation.ts` - Input validation rules
- `types.d.ts` - TypeScript type definitions

### Flow

```
1. User submits credentials
   POST /api/auth/signin
   Body: { email, password }
   ↓
2. Auth Controller
   - Validates input
   - Calls Auth Service
   ↓
3. Auth Service
   - Sanitizes email
   - Finds user in database
   - Compares password hash
   - Generates JWT token
   ↓
4. Response
   { user: {...}, token: "..." }
```

### Key Methods

#### `signIn(input: SignInInput)`
- Validates email and password
- Finds user by email
- Compares password using bcrypt
- Generates JWT token
- Returns user data and token

#### `generateToken(userId, role)`
- Creates JWT payload with userId, role, email
- Signs token with JWT_SECRET
- Sets expiration (7 days default)

### Security Features
- Password hashing with bcrypt
- Email sanitization
- Rate limiting on sign-in endpoint
- Secure token generation

---

## 👥 User Module

### Overview
Manages user accounts, profiles, and user-related operations.

### Files
- `User.controller.ts` - User CRUD operations
- `User.service.ts` - User business logic
- `User.model.ts` - User database schema
- `User.routes.ts` - User API routes

### User Model Schema

```typescript
{
  email: string (unique, required)
  username: string (unique, required)
  password: string (hashed, required)
  name: string (required)
  role: 'admin' | 'manager' | 'team' | 'student'
  studentId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Flow: Creating a User

```
1. Admin/Manager creates user
   POST /api/users
   Body: { email, username, password, name, role }
   ↓
2. User Controller
   - Validates input
   - Checks permissions (admin/manager only)
   - Calls User Service
   ↓
3. User Service
   - Validates email domain (if whitelist exists)
   - Checks if email/username exists
   - Hashes password
   - Creates user document
   - Saves to MongoDB
   ↓
4. Response
   { success: true, data: user }
```

### Key Methods

#### `createUser(data)`
- Validates email domain against whitelist
- Checks for duplicate email/username
- Hashes password
- Creates user with default role (student)
- Returns created user

#### `getAllUsers(query, page, limit)`
- Filters users by role, status, search term
- Paginates results
- Returns users with pagination info

#### `updateUser(id, data)`
- Updates user fields
- Re-hashes password if changed
- Validates role changes (only admin can change roles)
- Returns updated user

#### `deleteUser(id)`
- Soft deletes user (sets deletedAt)
- Prevents deletion of admin users
- Returns success status

### Role-Based Access
- **Admin**: Full access to all users
- **Manager**: Can manage users except admins
- **Team/Student**: Can only view/update own profile

---

## 📋 Request Module

### Overview
Manages service requests submitted by students and processed by staff.

### Files
- `Request.controller.ts` - Request handlers
- `Request.service.ts` - Request business logic
- `Request.model.ts` - Request database schema
- `Request.routes.ts` - Request API routes

### Request Model Schema

```typescript
{
  category: ObjectId (ref: Category)
  description: string (required)
  status: 'pending' | 'in-progress' | 'resolved' | 'cancelled'
  studentId: ObjectId (ref: User)
  studentName: string
  attachmentUrl?: string
  adminNotes?: string
  assignedTo?: ObjectId (ref: User)
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  deletedAt?: Date (soft delete)
}
```

### Flow: Creating a Request

```
1. Student submits request
   POST /api/requests
   Body: { category, description, attachment }
   ↓
2. Request Controller
   - Validates input
   - Extracts user from JWT
   - Handles file upload (if any)
   - Calls Request Service
   ↓
3. Request Service
   - Validates category exists
   - Creates request document
   - Sets default status (pending)
   - Saves to MongoDB
   - Emits Socket.io event
   ↓
4. Socket.io Event
   Emits 'request:created' to admin/manager rooms
   ↓
5. Response
   { success: true, data: request }
```

### Flow: Updating Request Status

```
1. Admin/Manager updates status
   PUT /api/requests/:id/status
   Body: { status, adminNotes }
   ↓
2. Request Controller
   - Validates status value
   - Checks permissions
   - Calls Request Service
   ↓
3. Request Service
   - Finds request
   - Updates status
   - Sets resolvedAt if status is 'resolved'
   - Saves to MongoDB
   - Emits Socket.io event
   ↓
4. Socket.io Event
   Emits 'request:updated' to:
   - Admin/Manager rooms
   - Student's personal room
   ↓
5. Response
   { success: true, data: updatedRequest }
```

### Key Methods

#### `createRequest(data, userId)`
- Validates category exists
- Creates request with student info
- Handles file attachment URL
- Sets default status and priority
- Emits 'request:created' event

#### `updateRequestStatus(id, status, adminNotes)`
- Validates status transition
- Updates request status
- Sets resolvedAt timestamp if resolved
- Emits 'request:updated' event

#### `getAllRequests(query, page, limit)`
- Filters by status, category, studentId, assignedTo
- Role-based filtering:
  - Students: Only their requests
  - Team: Assigned requests
  - Manager/Admin: All requests
- Paginates results
- Sorts by creation date (newest first)

#### `deleteRequest(id)`
- Soft deletes request (sets deletedAt)
- Only admin/manager/team can delete
- Emits 'request:deleted' event

### File Upload Handling
- Uses Multer middleware
- Validates file type (images, PDFs, documents)
- Validates file size (max 5MB)
- Stores files in `./uploads` directory
- Returns file URL in response

---

## 🏷️ Category Module

### Overview
Manages request categories dynamically.

### Files
- `Category.controller.ts` - Category CRUD operations
- `Category.service.ts` - Category business logic
- `Category.model.ts` - Category database schema
- `Category.routes.ts` - Category API routes

### Category Model Schema

```typescript
{
  name: string (required, unique)
  description?: string
  icon?: string
  isActive: boolean (default: true)
  createdAt: Date
  updatedAt: Date
}
```

### Flow: Creating a Category

```
1. Admin/Manager creates category
   POST /api/categories
   Body: { name, description, icon }
   ↓
2. Category Controller
   - Validates input
   - Checks permissions
   - Calls Category Service
   ↓
3. Category Service
   - Checks if name exists
   - Creates category document
   - Sets isActive: true
   - Saves to MongoDB
   ↓
4. Response
   { success: true, data: category }
```

### Key Methods

#### `createCategory(data)`
- Validates unique name
- Creates category with default isActive: true
- Returns created category

#### `getAllCategories(includeInactive)`
- Returns active categories by default
- Can include inactive if admin/manager
- Sorted by name

#### `updateCategory(id, data)`
- Updates category fields
- Validates name uniqueness (if changed)
- Returns updated category

#### `activateCategory(id)` / `deactivateCategory(id)`
- Toggles isActive status
- Prevents deactivation if category has active requests
- Returns updated category

---

## 📢 Announcement Module

### Overview
Manages campus announcements with real-time delivery.

### Files
- `Announcement.controller.ts` - Announcement handlers
- `Announcement.service.ts` - Announcement business logic
- `Announcement.model.ts` - Announcement database schema
- `Announcement.routes.ts` - Announcement API routes

### Announcement Model Schema

```typescript
{
  title: string (required)
  content: string (required)
  type: 'notice' | 'event' | 'cancellation'
  priority: 'high' | 'medium' | 'low'
  targetAudience: 'all' | 'students' | 'staff'
  createdBy: ObjectId (ref: User)
  readBy: [ObjectId] (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### Flow: Creating an Announcement

```
1. Admin/Manager creates announcement
   POST /api/announcements
   Body: { title, content, type, priority, targetAudience }
   ↓
2. Announcement Controller
   - Validates input
   - Extracts user from JWT
   - Calls Announcement Service
   ↓
3. Announcement Service
   - Creates announcement document
   - Sets createdBy to current user
   - Initializes readBy array
   - Saves to MongoDB
   - Emits Socket.io event
   ↓
4. Socket.io Event
   Emits 'announcement:created' to:
   - All users (if targetAudience: 'all')
   - Specific role rooms
   ↓
5. Response
   { success: true, data: announcement }
```

### Flow: Marking Announcement as Read

```
1. User views announcement
   PUT /api/announcements/:id/read
   ↓
2. Announcement Service
   - Finds announcement
   - Adds userId to readBy array
   - Saves to MongoDB
   ↓
3. Response
   { success: true }
```

### Key Methods

#### `createAnnouncement(data, userId)`
- Creates announcement with creator info
- Initializes readBy array
- Emits 'announcement:created' event
- Returns created announcement

#### `getUserAnnouncements(userId, filters)`
- Filters by targetAudience and user role
- Sorts by priority and date
- Returns announcements with read status

#### `getUnreadCount(userId)`
- Counts announcements not in readBy array
- Filters by targetAudience
- Returns count

#### `markAsRead(announcementId, userId)`
- Adds userId to readBy array
- Prevents duplicates
- Returns success status

---

## 📊 Analytics Module

### Overview
Provides statistics and analytics for requests and system usage.

### Files
- `Analytics.controller.ts` - Analytics endpoints
- `Analytics.service.ts` - Analytics calculations
- `Analytics.routes.ts` - Analytics routes

### Flow: Getting Analytics

```
1. Admin/Manager requests analytics
   GET /api/analytics/statistics
   ↓
2. Analytics Controller
   - Checks permissions
   - Calls Analytics Service
   ↓
3. Analytics Service
   - Queries MongoDB aggregations
   - Calculates statistics:
     * Total requests
     * Requests by status
     * Requests by category
     * Daily trends
     * Resolution rates
   ↓
4. Response
   { success: true, data: { statistics, charts } }
```

### Key Methods

#### `getStatistics()`
- Total requests count
- Active requests (pending + in-progress)
- Resolved requests
- Average resolution time
- Requests this month/week

#### `getCategoryChart()`
- Groups requests by category
- Calculates count and percentage
- Returns chart data

#### `getStatusChart()`
- Groups requests by status
- Calculates count and percentage
- Returns chart data

#### `getDailyChart(startDate, endDate)`
- Groups requests by date
- Counts requests per day
- Returns time series data

#### `getSummary()`
- Combines all analytics
- Returns comprehensive summary
- Used for dashboard

### MongoDB Aggregations

Uses MongoDB aggregation pipeline:
- `$match` - Filter documents
- `$group` - Group and count
- `$project` - Shape output
- `$sort` - Sort results

---

## 🗺️ Campus Map Module

### Overview
Manages campus map markers and locations.

### Files
- `CampusMap.controller.ts` - Map marker handlers
- `CampusMap.service.ts` - Map business logic
- `CampusMap.model.ts` - Map marker schema
- `CampusMap.routes.ts` - Map API routes

### Campus Map Model Schema

```typescript
{
  name: string (required)
  type: 'academic' | 'hostel' | 'cafeteria' | 'library' | 'other'
  coordinates: {
    lat: number (required)
    lng: number (required)
  }
  description?: string
  address?: string
  contactInfo?: string
  openingHours?: string
  isActive: boolean (default: true)
  createdAt: Date
  updatedAt: Date
}
```

### Flow: Creating a Map Marker

```
1. Admin creates marker
   POST /api/campus-map
   Body: { name, type, coordinates, description, ... }
   ↓
2. Campus Map Controller
   - Validates input
   - Validates coordinates
   - Calls Campus Map Service
   ↓
3. Campus Map Service
   - Validates coordinate format
   - Creates marker document
   - Sets isActive: true
   - Saves to MongoDB
   ↓
4. Response
   { success: true, data: marker }
```

### Key Methods

#### `createMarker(data)`
- Validates coordinates (lat: -90 to 90, lng: -180 to 180)
- Creates marker with location data
- Returns created marker

#### `getAllMarkers(includeInactive)`
- Returns active markers by default
- Can filter by category/type
- Returns markers with coordinates

#### `getMarkersByCategory(category)`
- Filters markers by type
- Returns only active markers
- Sorted by name

#### `updateMarker(id, data)`
- Updates marker fields
- Validates coordinates if changed
- Returns updated marker

#### `deleteMarker(id)`
- Soft deletes marker (sets isActive: false)
- Or hard deletes if needed
- Returns success status

---

## 🤖 AI Module

### Overview
Integrates with Google Gemini API for AI-powered campus assistant.

### Files
- `AI.controller.ts` - AI chat handlers
- `AI.service.ts` - AI business logic
- `AI.model.ts` - AI configuration schema
- `AI.routes.ts` - AI API routes

### AI Config Model Schema

```typescript
{
  systemPrompt: string (required)
  model: string (default: 'gemini-2.5-flash-lite')
  temperature: number (default: 0.7)
  maxTokens: number (default: 1000)
  updatedAt: Date
}
```

### Flow: AI Chat Request

```
1. User sends chat message
   POST /api/ai/chat
   Body: { message }
   ↓
2. AI Controller
   - Validates input
   - Calls AI Service
   ↓
3. AI Service
   - Retrieves system prompt from database
   - Constructs prompt with context
   - Calls Google Gemini API
   ↓
4. Google Gemini API
   - Processes prompt
   - Generates response
   - Returns AI response
   ↓
5. AI Service
   - Formats response
   - Returns to controller
   ↓
6. Response
   { success: true, data: { message: "AI response" } }
```

### Key Methods

#### `chat(message)`
- Retrieves system prompt from database
- Constructs full prompt with user message
- Calls Google Gemini API
- Returns AI response

#### `getSystemPrompt()`
- Returns current system prompt
- Admin only

#### `updateSystemPrompt(prompt)`
- Updates system prompt in database
- Admin only
- Used to customize AI behavior

### Google Gemini API Integration

```typescript
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent
Headers: {
  'Content-Type': 'application/json',
  'x-goog-api-key': GEMINI_API_KEY
}
Body: {
  contents: [{
    parts: [{
      text: systemPrompt + userMessage
    }]
  }]
}
```

---

## ⚙️ System Config Module

### Overview
Manages system-wide configuration settings.

### Files
- `SystemConfig.controller.ts` - Config handlers
- `SystemConfig.service.ts` - Config business logic
- `SystemConfig.model.ts` - Config schema
- `SystemConfig.routes.ts` - Config routes

### System Config Model Schema

```typescript
{
  projectName: string (required)
  logoUrl?: string
  emailDomains: [string] (whitelist)
  createdAt: Date
  updatedAt: Date
}
```

### Flow: Updating System Config

```
1. Admin updates config
   PUT /api/system-config/name
   Body: { projectName }
   ↓
2. System Config Controller
   - Validates input
   - Checks admin permission
   - Calls System Config Service
   ↓
3. System Config Service
   - Finds or creates config document
   - Updates field
   - Saves to MongoDB
   ↓
4. Response
   { success: true, data: config }
```

### Key Methods

#### `getPublicConfig()`
- Returns public config (projectName, logoUrl)
- Available to all users
- Used in frontend

#### `getFullConfig()`
- Returns full config including emailDomains
- Admin only

#### `updateProjectName(name)`
- Updates project name
- Admin only

#### `updateLogo(logoUrl)`
- Updates logo URL
- Admin only

#### `addEmailDomain(domain)`
- Adds domain to whitelist
- Admin only
- Used for user registration validation

#### `removeEmailDomain(domain)`
- Removes domain from whitelist
- Admin only

---

## 🔄 Module Interactions

### Request Flow with Multiple Modules

```
1. Student creates request
   Request Module → Category Module (validate category)
   ↓
2. Request created
   Request Module → Socket.io (emit event)
   ↓
3. Admin receives notification
   Socket.io → Frontend (real-time update)
   ↓
4. Admin updates request
   Request Module → User Module (get assigned user)
   ↓
5. Status updated
   Request Module → Analytics Module (update stats)
   Request Module → Socket.io (emit event)
   ↓
6. Student receives notification
   Socket.io → Frontend (real-time update)
```

### Announcement Flow

```
1. Admin creates announcement
   Announcement Module → User Module (get creator info)
   ↓
2. Announcement saved
   Announcement Module → Socket.io (emit to target audience)
   ↓
3. Users receive notification
   Socket.io → Frontend (real-time update)
   ↓
4. User views announcement
   Announcement Module → Update readBy array
```

---

## 📚 Next Steps

- [Backend API Reference](./BACKEND_API.md) - Complete API documentation
- [Database Schema](./BACKEND_DATABASE.md) - Detailed database models
- [Frontend Documentation](./FRONTEND_OVERVIEW.md) - Frontend architecture

