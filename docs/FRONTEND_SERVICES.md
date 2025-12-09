# Frontend Services Documentation

## 📋 Table of Contents

1. [API Client](#api-client)
2. [API Service](#api-service)
3. [Auth Service](#auth-service)
4. [Socket Service](#socket-service)

---

## 🔌 API Client

### api.client.ts
**Purpose**: Configured Axios instance

**Features**:
- Base URL configuration
- Request interceptors (JWT token)
- Response interceptors (error handling)
- Type-safe responses

**Configuration**:
```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Request Interceptor**:
```typescript
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor**:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📡 API Service

### api.ts
**Purpose**: REST API service methods

**Structure**:
```typescript
class ApiService {
  // Request methods
  async getRequests(params): Promise<ServiceRequest[]>
  async createRequest(data): Promise<ServiceRequest>
  async updateRequest(id, data): Promise<ServiceRequest>
  async deleteRequest(id): Promise<void>

  // User methods
  async getUsers(params): Promise<User[]>
  async createUser(data): Promise<User>
  // ... more methods
}
```

### Request Methods

#### `getRequests(params)`
**Purpose**: Fetch requests with filters

**Parameters**:
```typescript
{
  status?: string
  category?: string
  studentId?: string
  page?: number
  limit?: number
}
```

**Returns**: `ServiceRequest[]`

**Flow**:
```
1. Builds query parameters
2. Makes GET request to /api/requests
3. Returns requests array
```

#### `createRequest(data)`
**Purpose**: Create new request

**Parameters**:
```typescript
{
  category: string
  description: string
  studentName?: string
  attachment?: File
}
```

**Returns**: `ServiceRequest`

**Flow**:
```
1. Creates FormData if attachment exists
2. Makes POST request to /api/requests
3. Returns created request
```

#### `updateRequestStatus(id, status, adminNotes)`
**Purpose**: Update request status

**Parameters**:
```typescript
id: string
status: 'pending' | 'in-progress' | 'resolved'
adminNotes?: string
```

**Returns**: `ServiceRequest`

**Flow**:
```
1. Makes PUT request to /api/requests/:id/status
2. Returns updated request
```

### User Methods

#### `getUsers(params)`
**Purpose**: Fetch users with filters

**Parameters**:
```typescript
{
  role?: string
  search?: string
  page?: number
  limit?: number
}
```

**Returns**: `User[]`

#### `createUser(data)`
**Purpose**: Create new user

**Parameters**:
```typescript
{
  email: string
  username: string
  password: string
  name: string
  role: string
}
```

**Returns**: `User`

### Announcement Methods

#### `getAnnouncements()`
**Purpose**: Fetch user's announcements

**Returns**: `Announcement[]`

#### `createAnnouncement(data)`
**Purpose**: Create announcement (admin/manager)

**Parameters**:
```typescript
{
  title: string
  content: string
  type: 'notice' | 'event' | 'cancellation'
  priority: 'high' | 'medium' | 'low'
  targetAudience: 'all' | 'students' | 'staff'
}
```

**Returns**: `Announcement`

#### `markAnnouncementAsRead(id)`
**Purpose**: Mark announcement as read

**Returns**: `void`

### Analytics Methods

#### `getAnalyticsStatistics()`
**Purpose**: Get analytics statistics

**Returns**: `AnalyticsOverview`

#### `getCategoryChart()`
**Purpose**: Get category chart data

**Returns**: `CategoryStats[]`

#### `getStatusChart()`
**Purpose**: Get status chart data

**Returns**: `StatusStats[]`

#### `getDailyChart(startDate, endDate)`
**Purpose**: Get daily trend data

**Returns**: `TrendData[]`

### Campus Map Methods

#### `getCampusMarkers()`
**Purpose**: Get all active markers

**Returns**: `CampusLocation[]`

#### `createMarker(data)`
**Purpose**: Create map marker (admin)

**Parameters**:
```typescript
{
  name: string
  type: string
  coordinates: { lat: number, lng: number }
  description?: string
}
```

**Returns**: `CampusLocation`

### AI Methods

#### `chat(message)`
**Purpose**: Send message to AI chatbot

**Parameters**:
```typescript
{
  message: string
}
```

**Returns**: `{ message: string }`

### System Config Methods

#### `getSystemConfig()`
**Purpose**: Get system configuration

**Returns**: `SystemConfig`

#### `updateProjectName(name)`
**Purpose**: Update project name (admin)

**Returns**: `SystemConfig`

#### `updateLogo(logoUrl)`
**Purpose**: Update logo (admin)

**Returns**: `SystemConfig`

---

## 🔐 Auth Service

### auth.service.ts
**Purpose**: Authentication operations

**Methods**:

#### `signIn(email, password)`
**Purpose**: User sign in

**Flow**:
```
1. Makes POST request to /api/auth/signin
2. Receives { user, token }
3. Stores token in localStorage
4. Returns user data
```

#### `signOut()`
**Purpose**: User sign out

**Flow**:
```
1. Clears token from localStorage
2. Clears user from context
3. Redirects to login
```

#### `getCurrentUser()`
**Purpose**: Get current user from token

**Flow**:
```
1. Retrieves token from localStorage
2. Decodes JWT token
3. Returns user data
```

---

## 🔔 Socket Service

### socket.ts
**Purpose**: Socket.io client service

**Class Structure**:
```typescript
class SocketService {
  private socket: Socket | null = null;

  connect(): Socket
  disconnect(): void
  joinRequestRoom(requestId: string): void
  sendMessage(requestId: string, message: string): void
  onNewMessage(callback: Function): void
  onRequestStatusUpdate(callback: Function): void
  // ... more methods
}
```

### Methods

#### `connect()`
**Purpose**: Connect to Socket.io server

**Flow**:
```
1. Creates Socket.io connection
2. Authenticates with JWT token
3. Sets up connection handlers
4. Returns socket instance
```

#### `joinRequestRoom(requestId)`
**Purpose**: Join room for specific request

**Flow**:
```
1. Emits 'join-request-room' event
2. Server adds socket to room
3. Receives events for this request
```

#### `sendMessage(requestId, message)`
**Purpose**: Send chat message

**Flow**:
```
1. Emits 'send-message' event
2. Server broadcasts to room
3. Other participants receive message
```

#### `onNewMessage(callback)`
**Purpose**: Listen for new messages

**Usage**:
```typescript
socketService.onNewMessage((message) => {
  // Handle new message
});
```

#### `onRequestStatusUpdate(callback)`
**Purpose**: Listen for request status updates

**Usage**:
```typescript
socketService.onRequestStatusUpdate((data) => {
  // Handle status update
});
```

---

## 🔄 Service Flow Examples

### Creating a Request

```
Component
  ↓
apiService.createRequest(data)
  ↓
api.client.ts (adds JWT token)
  ↓
POST /api/requests
  ↓
Backend processes
  ↓
Response: ServiceRequest
  ↓
Component receives response
  ↓
Updates UI
```

### Real-time Updates

```
Backend emits event
  ↓
Socket.io server
  ↓
socketService receives event
  ↓
Hook callback triggered
  ↓
Component state updates
  ↓
UI re-renders
```

---

## 📚 Service Best Practices

1. **Type Safety**: Use TypeScript interfaces
2. **Error Handling**: Handle errors consistently
3. **Token Management**: Automatically add JWT tokens
4. **Response Format**: Standardize response format
5. **Reusability**: Make services reusable
6. **Documentation**: Document all methods
7. **Testing**: Write tests for services

---

## 🎯 Next Steps

- [Integration Guide](./INTEGRATION_GUIDE.md) - How everything connects
- [Backend Modules](./BACKEND_MODULES.md) - Backend module documentation

