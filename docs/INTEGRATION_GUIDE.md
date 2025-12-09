# Integration Guide - Complete System Flow

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [End-to-End Flows](#end-to-end-flows)
3. [Data Flow](#data-flow)
4. [Real-time Communication](#real-time-communication)
5. [Authentication Flow](#authentication-flow)
6. [Error Handling](#error-handling)

---

## 🏗️ System Architecture

### Complete System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Pages   │  │Components│  │  Hooks   │  │ Contexts │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │             │             │             │          │
│       └─────────────┼─────────────┼─────────────┘          │
│                     │             │                        │
│              ┌──────▼──────┐ ┌───▼──────┐                 │
│              │ API Service │ │  Socket  │                 │
│              └──────┬──────┘ └───┬──────┘                 │
└─────────────────────┼────────────┼────────────────────────┘
                      │            │
              ┌───────▼────────────▼────────┐
              │      Backend (Express)      │
              │  ┌──────────┐  ┌──────────┐│
              │  │ Routes   │  │Middleware││
              │  └────┬─────┘  └────┬─────┘│
              │       │             │      │
              │  ┌────▼─────────────▼──┐  │
              │  │   Controllers       │  │
              │  └────┬────────────────┘  │
              │       │                   │
              │  ┌────▼──────────────┐   │
              │  │    Services       │   │
              │  └────┬──────────────┘   │
              │       │                  │
              │  ┌────▼──────────────┐   │
              │  │     Models        │   │
              │  └────┬──────────────┘   │
              │       │                  │
              │  ┌────▼──────────────┐   │
              │  │   Socket.io       │   │
              │  └────┬──────────────┘   │
              └───────┼──────────────────┘
                      │
              ┌───────▼────────┐
              │    MongoDB     │
              └────────────────┘
```

---

## 🔄 End-to-End Flows

### 1. User Authentication Flow

```
┌─────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│  User   │────────▶│ Frontend │────────▶│ Backend │────────▶│ MongoDB  │
└─────────┘         └──────────┘         └─────────┘         └──────────┘
     │                    │                    │                    │
     │  1. Enter creds    │                    │                    │
     │───────────────────▶│                    │                    │
     │                    │  2. POST /auth     │                    │
     │                    │───────────────────▶│                    │
     │                    │                    │  3. Validate user  │
     │                    │                    │───────────────────▶│
     │                    │                    │  4. User data      │
     │                    │                    │◀───────────────────│
     │                    │  5. {user, token}  │                    │
     │                    │◀───────────────────│                    │
     │  6. Redirect       │                    │                    │
     │◀───────────────────│                    │                    │
     │                    │  7. Store token    │                    │
     │                    │    Update context  │                    │
```

**Steps**:
1. User enters email and password
2. Frontend calls `authService.signIn()`
3. Backend validates credentials
4. Backend queries MongoDB for user
5. Backend generates JWT token
6. Frontend stores token and updates AuthContext
7. User redirected to dashboard

---

### 2. Request Submission Flow

```
┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐
│ Student │  │ Frontend │  │ Backend │  │ MongoDB  │  │ Socket  │
└────┬────┘  └────┬─────┘  └────┬────┘  └────┬─────┘  └────┬────┘
     │            │             │            │             │
     │ 1. Fill form            │            │             │
     │───────────▶│             │            │             │
     │            │ 2. Submit   │            │             │
     │            │────────────▶│            │             │
     │            │             │ 3. Validate│             │
     │            │             │ 4. Save    │             │
     │            │             │───────────▶│             │
     │            │             │ 5. Created │             │
     │            │             │◀───────────│             │
     │            │             │ 6. Emit    │             │
     │            │             │────────────┼────────────▶│
     │            │ 7. Success  │            │             │
     │            │◀────────────│            │             │
     │ 8. Toast   │             │            │             │
     │◀───────────│             │            │             │
     │            │             │            │ 9. Event    │
     │            │             │            │────────────▶│
     │            │ 10. Update  │            │             │
     │            │◀────────────┼────────────┼─────────────│
```

**Steps**:
1. Student fills request form
2. Frontend calls `apiService.createRequest()`
3. Backend validates input and category
4. Backend saves request to MongoDB
5. MongoDB returns created request
6. Backend emits Socket.io event
7. Frontend receives success response
8. Frontend shows success toast
9. Socket.io broadcasts to admin/manager rooms
10. Admin dashboards update in real-time

---

### 3. Request Status Update Flow

```
┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐
│  Admin  │  │ Frontend │  │ Backend │  │ MongoDB  │  │ Socket  │
└────┬────┘  └────┬─────┘  └────┬────┘  └────┬─────┘  └────┬────┘
     │            │             │            │             │
     │ 1. Update  │             │            │             │
     │───────────▶│             │            │             │
     │            │ 2. PUT      │            │             │
     │            │────────────▶│            │             │
     │            │             │ 3. Update  │             │
     │            │             │───────────▶│             │
     │            │             │ 4. Updated │             │
     │            │             │◀───────────│             │
     │            │             │ 5. Emit    │             │
     │            │             │────────────┼────────────▶│
     │            │ 6. Success  │            │             │
     │            │◀────────────│            │             │
     │ 7. Updated │             │            │             │
     │◀───────────│             │            │             │
     │            │             │            │ 8. Event    │
     │            │             │            │────────────▶│
     │            │ 9. Update   │            │             │
     │            │◀────────────┼────────────┼─────────────│
```

**Steps**:
1. Admin updates request status
2. Frontend calls `apiService.updateRequestStatus()`
3. Backend updates request in MongoDB
4. MongoDB returns updated request
5. Backend emits Socket.io event
6. Frontend receives success response
7. Admin dashboard updates
8. Socket.io broadcasts to student's room
9. Student's request history updates in real-time

---

### 4. Real-time Notification Flow

```
┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐
│ Backend │  │ Socket.io│  │ Frontend│  │   User   │
└────┬────┘  └────┬─────┘  └────┬────┘  └────┬─────┘
     │            │             │            │
     │ 1. Action  │             │            │
     │───────────▶│             │            │
     │            │ 2. Emit     │            │
     │            │────────────▶│            │
     │            │             │ 3. Receive │
     │            │             │───────────▶│
     │            │             │ 4. Update  │
     │            │             │            │
     │            │             │ 5. Toast   │
     │            │             │───────────▶│
```

**Steps**:
1. Backend action occurs (request created, status updated, etc.)
2. Backend emits Socket.io event
3. Frontend Socket.io client receives event
4. Hook callback updates component state
5. UI updates and shows toast notification

---

## 📊 Data Flow

### Request Data Flow

```
User Input
    ↓
Component State
    ↓
API Service
    ↓
API Client (adds JWT)
    ↓
HTTP Request
    ↓
Backend Route
    ↓
Controller
    ↓
Service
    ↓
Model (MongoDB)
    ↓
Database
    ↓
Response
    ↓
API Service
    ↓
Component State
    ↓
UI Update
```

### Real-time Data Flow

```
Backend Action
    ↓
Socket.io Server
    ↓
Emit Event
    ↓
Socket.io Client
    ↓
Hook Callback
    ↓
Component State
    ↓
UI Update
```

---

## 🔔 Real-time Communication

### Socket.io Event Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Socket.io Events                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Request Events:                                        │
│  • request:created  → Admin/Manager rooms              │
│  • request:updated  → Admin/Manager + Student rooms    │
│  • request:deleted  → Admin/Manager rooms              │
│                                                         │
│  Announcement Events:                                   │
│  • announcement:created → All users or role-specific   │
│  • announcement:deleted → All users                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Room Structure

```
Socket.io Rooms:
├── role:admin      (All admins)
├── role:manager    (All managers)
├── role:team       (All team members)
├── role:student    (All students)
└── user:{userId}   (Individual user)
```

---

## 🔐 Authentication Flow

### Complete Authentication Flow

```
1. User Login
   ↓
2. Frontend: authService.signIn()
   ↓
3. Backend: POST /api/auth/signin
   ↓
4. Backend: Validate credentials
   ↓
5. Backend: Generate JWT token
   ↓
6. Frontend: Store token in localStorage
   ↓
7. Frontend: Update AuthContext
   ↓
8. Frontend: Redirect to dashboard
   ↓
9. Subsequent Requests:
   - API Client adds JWT to headers
   - Backend validates JWT
   - Request proceeds
```

### Token Usage

```
Every API Request:
1. Frontend retrieves token from localStorage
2. API Client adds to Authorization header
3. Backend middleware validates token
4. Backend extracts user info from token
5. Request proceeds with user context
```

---

## ⚠️ Error Handling

### Error Flow

```
Error Occurs
    ↓
API Client Interceptor
    ↓
Check Error Type:
    ├─ 401 (Unauthorized)
    │   → Clear token
    │   → Redirect to login
    │
    ├─ 403 (Forbidden)
    │   → Show error message
    │   → Redirect to unauthorized
    │
    ├─ 404 (Not Found)
    │   → Show error message
    │
    ├─ 500 (Server Error)
    │   → Show error message
    │   → Log error
    │
    └─ Network Error
        → Show connection error
        → Retry option
```

### Error Handling in Components

```typescript
try {
  const data = await apiService.getData();
  // Handle success
} catch (error) {
  // Error interceptor already handled:
  // - 401 redirects to login
  // - Other errors show toast
  // Component can show additional UI if needed
}
```

---

## 🔄 Complete Request Lifecycle

### From Submission to Resolution

```
1. Student Submits Request
   ├─ Frontend: ServiceRequest.tsx
   ├─ API: POST /api/requests
   ├─ Backend: RequestService.createRequest()
   ├─ Database: Request saved
   └─ Socket: 'request:created' event

2. Admin Views Request
   ├─ Frontend: RequestManagement.tsx
   ├─ API: GET /api/requests
   ├─ Backend: RequestService.getAllRequests()
   └─ Database: Query requests

3. Admin Updates Status
   ├─ Frontend: UpdateRequestStatusModal
   ├─ API: PUT /api/requests/:id/status
   ├─ Backend: RequestService.updateRequestStatus()
   ├─ Database: Request updated
   └─ Socket: 'request:updated' event

4. Student Sees Update
   ├─ Socket: Receives 'request:updated' event
   ├─ Frontend: RequestHistory.tsx updates
   ├─ Toast: Notification shown
   └─ UI: Status badge updates

5. Request Resolved
   ├─ Admin: Sets status to 'resolved'
   ├─ Database: resolvedAt timestamp set
   ├─ Socket: 'request:updated' event
   └─ Analytics: Resolution tracked
```

---

## 📚 Integration Best Practices

1. **Consistent Error Handling**: Use API client interceptors
2. **Type Safety**: Use TypeScript throughout
3. **Real-time Updates**: Use Socket.io for live updates
4. **Loading States**: Show loading indicators
5. **Optimistic Updates**: Update UI immediately, sync with server
6. **Error Recovery**: Provide retry mechanisms
7. **Token Management**: Secure token storage and refresh

---

## 🎯 Next Steps

- [Backend Overview](./BACKEND_OVERVIEW.md) - Backend architecture
- [Frontend Overview](./FRONTEND_OVERVIEW.md) - Frontend architecture
- [Backend Modules](./BACKEND_MODULES.md) - Backend module details
- [Frontend Components](./FRONTEND_COMPONENTS.md) - Frontend component details

