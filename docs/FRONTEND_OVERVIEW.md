# Frontend Overview - Campus Helper Platform

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Application Flow](#application-flow)
5. [State Management](#state-management)
6. [Routing](#routing)
7. [API Integration](#api-integration)
8. [Real-time Communication](#real-time-communication)

---

## 🏗️ Architecture

The frontend follows a **component-based architecture** with clear separation of concerns:

```
Frontend Architecture:
┌─────────────────────────────────────────────────────────┐
│                    React Application                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Pages      │  │  Components  │  │    Hooks     │ │
│  │  - Home      │  │  - Layout    │  │  - useAuth   │ │
│  │  - Dashboard │  │  - Forms     │  │  - useSocket │ │
│  │  - Requests  │  │  - Modals    │  │  - useRequests│ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                 │                 │          │
│         └─────────────────┼─────────────────┘          │
│                           │                            │
│                    ┌──────▼──────┐                     │
│                    │  Contexts   │                     │
│                    │  - Auth     │                     │
│                    │  - Theme    │                     │
│                    │  - Config   │                     │
│                    └──────┬──────┘                     │
│                           │                            │
│                    ┌──────▼──────┐                     │
│                    │  Services   │                     │
│                    │  - API      │                     │
│                    │  - Socket   │                     │
│                    │  - Auth     │                     │
│                    └──────┬──────┘                     │
└───────────────────────────┼────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  Backend API   │
                    │  + Socket.io   │
                    └────────────────┘
```

### Layer Responsibilities

1. **Pages Layer**: Route-level components, page layouts
2. **Components Layer**: Reusable UI components
3. **Hooks Layer**: Custom React hooks for logic reuse
4. **Contexts Layer**: Global state management
5. **Services Layer**: API calls and external integrations
6. **Utils Layer**: Helper functions and utilities

---

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout/         # Layout components (Navbar, Sidebar)
│   ├── Analytics/      # Analytics charts and statistics
│   ├── Announcements/  # Announcement components
│   ├── CampusMap/      # Campus map marker modals
│   ├── CategoryManagement/ # Category management modals
│   ├── Chatbot/        # AI Chatbot component
│   ├── Profile/        # User profile components
│   ├── RequestHistory/ # Request history components
│   ├── RequestManagement/ # Request management components
│   ├── SystemConfig/   # System configuration components
│   ├── TeamRequests/   # Team request components
│   └── UserManagement/ # User management components
├── contexts/           # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   ├── ThemeContext.tsx     # Dark/light mode
│   ├── SystemConfigContext.tsx # System config
│   └── AnnouncementContext.tsx # Announcements
├── hooks/              # Custom React hooks
│   ├── useSocket.ts          # Socket.io connection
│   ├── useStudentSocket.ts   # Student-specific socket
│   ├── useTeamSocket.ts      # Team-specific socket
│   ├── useNotifications.ts   # Notifications handling
│   ├── useRequests.ts        # Request data management
│   └── usePageTitle.ts       # Page title management
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── ServiceRequest.tsx
│   ├── RequestHistory.tsx
│   ├── RequestManagement.tsx
│   ├── TeamRequestsList.tsx
│   ├── Map.tsx
│   ├── CampusMapManagement.tsx
│   ├── Announcements.tsx
│   ├── UserManagement.tsx
│   ├── CategoryManagement.tsx
│   ├── SystemConfig.tsx
│   ├── Profile.tsx
│   └── Chat.tsx
├── services/           # API and service integrations
│   ├── api.client.ts   # Axios client configuration
│   ├── api.ts          # REST API service methods
│   ├── auth.service.ts # Authentication service
│   └── socket.ts       # Socket.io service
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── helpers.ts      # General helpers
│   ├── storage.ts      # Local storage utilities
│   ├── token.ts        # Token management
│   └── auth.helpers.ts # Auth helpers
├── App.tsx             # Main App component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

---

## 🛠️ Technology Stack

### Core Technologies
- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **React Router v6**: Client-side routing

### UI Libraries
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hot Toast**: Toast notifications

### Data Visualization
- **Recharts**: Chart library
- **Chart.js**: Alternative chart library

### Maps
- **React Leaflet**: React wrapper for Leaflet
- **Leaflet**: Interactive maps library

### Communication
- **Axios**: HTTP client
- **Socket.io Client**: Real-time communication

---

## 🔄 Application Flow

### Initial Load Flow

```
1. User visits application
   ↓
2. main.tsx renders App component
   ↓
3. App.tsx sets up routing
   ↓
4. Route matches (e.g., /login)
   ↓
5. ProtectedRoute checks authentication
   ↓
6. If not authenticated → Redirect to /login
   If authenticated → Render page component
   ↓
7. Page component mounts
   ├─ Fetches data via API service
   ├─ Sets up Socket.io connection
   └─ Renders UI components
```

### Authentication Flow

```
1. User enters credentials
   Login.tsx → auth.service.signIn()
   ↓
2. API Service
   POST /api/auth/signin
   ↓
3. Backend validates
   Returns { user, token }
   ↓
4. Auth Service
   - Stores token in localStorage
   - Updates AuthContext
   ↓
5. AuthContext
   - Sets user state
   - Sets isAuthenticated: true
   ↓
6. Navigation
   - Redirects to dashboard
   - Protected routes now accessible
```

### Request Submission Flow

```
1. Student fills form
   ServiceRequest.tsx
   ↓
2. Form submission
   apiService.createRequest(data)
   ↓
3. API Service
   POST /api/requests (multipart/form-data)
   ↓
4. Backend processes
   - Validates input
   - Handles file upload
   - Creates request
   - Emits Socket.io event
   ↓
5. Socket.io Event
   'request:created' → Admin/Manager dashboards
   ↓
6. Frontend Updates
   - Toast notification
   - Request list updates (if on dashboard)
   - Form resets
```

### Real-time Update Flow

```
1. Backend action occurs
   (e.g., request status updated)
   ↓
2. Backend emits Socket.io event
   io.emit('request:updated', data)
   ↓
3. Socket Service receives event
   socketService.on('request:updated', callback)
   ↓
4. Hook processes event
   useRequests hook updates state
   ↓
5. Component re-renders
   Request list updates automatically
   ↓
6. Toast notification
   User sees update notification
```

---

## 🗂️ State Management

### Context API

The application uses React Context for global state:

#### AuthContext
```typescript
{
  user: User | null
  isAuthenticated: boolean
  signIn: (email, password) => Promise<void>
  signOut: () => void
  updateUser: (userData) => void
}
```

#### ThemeContext
```typescript
{
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
```

#### SystemConfigContext
```typescript
{
  config: SystemConfig | null
  projectName: string
  logoUrl: string
  refreshConfig: () => Promise<void>
}
```

#### AnnouncementContext
```typescript
{
  unreadCount: number
  refreshUnreadCount: () => Promise<void>
}
```

### Local State

Components use `useState` for local state:
- Form inputs
- Modal visibility
- Loading states
- UI interactions

### Server State

Custom hooks manage server state:
- `useRequests` - Request data
- `useNotifications` - Notifications
- `useSocket` - Socket connection state

---

## 🛣️ Routing

### Route Structure

```typescript
/                    → Home (public)
/login               → Login (public)
/dashboard           → Analytics Dashboard (protected)
/request             → Submit Request (protected)
/history             → Request History (protected, student)
/requests            → Request Management (protected, admin/manager)
/team-requests       → Team Requests (protected, team)
/map                 → Campus Map (protected)
/map-management      → Map Management (protected, admin)
/announcements       → Announcements (protected)
/users               → User Management (protected, admin/manager)
/categories          → Category Management (protected, admin/manager)
/config              → System Config (protected, admin)
/profile             → User Profile (protected)
/chat/:requestId     → Chat (protected)
/unauthorized        → Unauthorized (public)
```

### Protected Routes

```typescript
<ProtectedRoute 
  path="/dashboard" 
  component={Dashboard}
  requiredRole={['admin', 'manager', 'team']}
/>
```

### Route Guards

- **Authentication Guard**: Checks if user is logged in
- **Role Guard**: Checks if user has required role
- **Redirect**: Unauthorized users → /unauthorized

---

## 🔌 API Integration

### API Service Architecture

```
Component → apiService.method() → api.client.ts → Backend API
```

### API Client Configuration

```typescript
// api.client.ts
- Base URL from environment
- Request interceptors (add JWT token)
- Response interceptors (handle errors)
- Error handling
```

### API Service Methods

```typescript
// api.ts
- Request methods (getRequests, createRequest, etc.)
- User methods (getUsers, createUser, etc.)
- Announcement methods
- Analytics methods
- All methods are type-safe
```

### Error Handling

```typescript
try {
  const data = await apiService.getRequests();
} catch (error) {
  // Error interceptor handles:
  // - 401: Redirect to login
  // - 403: Show unauthorized message
  // - 500: Show server error
  // - Network errors: Show connection error
}
```

---

## 🔔 Real-time Communication

### Socket.io Integration

#### Connection Setup

```typescript
// socket.ts
- Connects to Socket.io server
- Authenticates with JWT token
- Handles reconnection
- Manages connection state
```

#### Event Listeners

```typescript
// useSocket hook
socket.on('request:created', handleRequestCreated);
socket.on('request:updated', handleRequestUpdated);
socket.on('announcement:created', handleAnnouncementCreated);
```

#### Room Management

```typescript
// Role-based rooms
socket.emit('join-room', `role:${user.role}`);
socket.emit('join-room', `user:${user.id}`);
```

### Real-time Updates

1. **Request Updates**: Dashboard updates automatically
2. **Notifications**: Toast notifications appear
3. **Announcements**: Unread count updates
4. **Chat**: Messages appear in real-time

---

## 🎨 Styling Architecture

### Tailwind CSS

- Utility-first approach
- Responsive design with breakpoints
- Dark mode support
- Custom color palette

### Custom Classes

Defined in `index.css`:
- `.btn` - Button base styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input` - Input field styles
- `.card` - Card container
- `.badge` - Status badges

### Dark Mode

```typescript
// ThemeContext manages theme
// Tailwind dark: classes toggle
// localStorage persists preference
```

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

### Mobile-First Approach

- Base styles for mobile
- `md:` prefix for tablet+
- `lg:` prefix for desktop+

### Responsive Components

- Sidebar collapses on mobile
- Tables become cards on mobile
- Navigation adapts to screen size

---

## 🔐 Authentication & Authorization

### Token Management

```typescript
// token.ts
- Store token in localStorage
- Retrieve token for API calls
- Clear token on logout
- Check token expiration
```

### Protected Routes

```typescript
// ProtectedRoute component
- Checks authentication
- Checks user role
- Redirects if unauthorized
```

### API Authentication

```typescript
// Request interceptor
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📚 Next Steps

- [Frontend Components](./FRONTEND_COMPONENTS.md) - Component documentation
- [Frontend Pages](./FRONTEND_PAGES.md) - Page documentation
- [Frontend Hooks](./FRONTEND_HOOKS.md) - Custom hooks documentation
- [Frontend Services](./FRONTEND_SERVICES.md) - Service layer documentation

