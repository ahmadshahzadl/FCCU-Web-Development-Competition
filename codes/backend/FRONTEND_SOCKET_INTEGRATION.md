# Frontend Socket.io Integration Documentation

Real-time updates for the Requests module using Socket.io. This enables automatic page updates without manual refresh and provides toast notifications for users.

## Table of Contents

1. [Overview](#overview)
2. [Socket Events](#socket-events)
3. [Installation](#installation)
4. [Socket Service Setup](#socket-service-setup)
5. [Integration Examples](#integration-examples)
6. [Role-Based Notifications](#role-based-notifications)
7. [Toast Notifications](#toast-notifications)
8. [Best Practices](#best-practices)

---

## Overview

Socket.io provides real-time bidirectional communication between the server and clients. When requests are created, updated, or deleted, all relevant users receive instant notifications without page refresh.

### Features:
- ✅ Real-time request updates (no page refresh needed)
- ✅ Toast notifications for students when their requests are updated
- ✅ Team members notified when a request they're viewing is resolved
- ✅ Automatic list updates for admins/managers/team
- ✅ Role-based event filtering

---

## Socket Events

### Server → Client Events

#### 1. `request:created`
Emitted when a new request is created.

**Recipients**: All admins, managers, team members, and the student who created it

**Payload**:
```typescript
{
  request: {
    _id: string;
    category: string;
    description: string;
    status: 'pending' | 'in-progress' | 'resolved';
    studentId?: string;
    studentName?: string;
    // ... other request fields
  }
}
```

#### 2. `request:updated`
Emitted when a request is updated (any field).

**Recipients**: All admins, managers, team members, and the student who owns it

**Payload**:
```typescript
{
  request: {
    _id: string;
    // ... updated request fields
  };
  updatedBy?: string; // Username of who updated it
}
```

#### 3. `request:status_updated`
Emitted when request status changes.

**Recipients**: All admins, managers, team members, and the student who owns it

**Payload**:
```typescript
{
  request: {
    _id: string;
    status: 'pending' | 'in-progress' | 'resolved';
    // ... other request fields
  };
  oldStatus: string;
  newStatus: string;
  updatedBy?: string;
}
```

#### 4. `user:request_updated`
Emitted specifically to the student who owns the request when it's updated.

**Recipients**: Only the student who owns the request

**Payload**:
```typescript
{
  request: {
    _id: string;
    status: 'pending' | 'in-progress' | 'resolved';
    adminNotes?: string;
    // ... other request fields
  };
  updatedBy?: string;
}
```

#### 5. `request:resolved`
Emitted when a request is resolved (status changes to 'resolved').

**Recipients**: Team members who have joined the request room (viewing that specific request)

**Payload**:
```typescript
{
  request: {
    _id: string;
    status: 'resolved';
    adminNotes?: string;
    resolvedAt?: string;
    // ... other request fields
  };
  oldStatus: string;
  newStatus: 'resolved';
  updatedBy?: string;
}
```

#### 6. `request:deleted`
Emitted when a request is deleted.

**Recipients**: All admins, managers, and team members

**Payload**:
```typescript
{
  requestId: string;
  deletedBy?: string;
}
```

### Client → Server Events

#### 1. `join:request`
Join a request-specific room to receive updates about a specific request.

**Payload**: `requestId` (string)

**Usage**: Team members viewing a request details page should join this room.

#### 2. `leave:request`
Leave a request-specific room.

**Payload**: `requestId` (string)

**Usage**: When navigating away from a request details page.

---

## Installation

### Install Socket.io Client

```bash
npm install socket.io-client
```

### TypeScript Types (Optional)

```bash
npm install --save-dev @types/socket.io-client
```

---

## Socket Service Setup

### 1. Socket Service (`services/socketService.ts`)

```typescript
import { io, Socket } from 'socket.io-client';
import { Request } from './services';

// Socket event types
export interface RequestCreatedPayload {
  request: Request;
}

export interface RequestUpdatedPayload {
  request: Request;
  updatedBy?: string;
}

export interface RequestStatusUpdatedPayload {
  request: Request;
  oldStatus: string;
  newStatus: string;
  updatedBy?: string;
}

export interface UserRequestUpdatedPayload {
  request: Request;
  updatedBy?: string;
}

export interface RequestResolvedPayload {
  request: Request;
  oldStatus: string;
  newStatus: string;
  updatedBy?: string;
}

export interface RequestDeletedPayload {
  requestId: string;
  deletedBy?: string;
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string, serverUrl: string = 'http://localhost:3000'): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(serverUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, reconnect manually
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join request room (for team members viewing a request)
  joinRequestRoom(requestId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join:request', requestId);
    }
  }

  // Leave request room
  leaveRequestRoom(requestId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave:request', requestId);
    }
  }

  // Listen for request created
  onRequestCreated(callback: (payload: RequestCreatedPayload) => void): void {
    this.socket?.on('request:created', callback);
  }

  // Listen for request updated
  onRequestUpdated(callback: (payload: RequestUpdatedPayload) => void): void {
    this.socket?.on('request:updated', callback);
  }

  // Listen for request status updated
  onRequestStatusUpdated(callback: (payload: RequestStatusUpdatedPayload) => void): void {
    this.socket?.on('request:status_updated', callback);
  }

  // Listen for user's own request updated (student-specific)
  onUserRequestUpdated(callback: (payload: UserRequestUpdatedPayload) => void): void {
    this.socket?.on('user:request_updated', callback);
  }

  // Listen for request resolved (team member viewing request)
  onRequestResolved(callback: (payload: RequestResolvedPayload) => void): void {
    this.socket?.on('request:resolved', callback);
  }

  // Listen for request deleted
  onRequestDeleted(callback: (payload: RequestDeletedPayload) => void): void {
    this.socket?.on('request:deleted', callback);
  }

  // Remove all listeners
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
```

### 2. Initialize Socket in Auth Context (`contexts/AuthContext.tsx`)

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { socketService } from '../services/socketService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  // ... other auth methods
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  useEffect(() => {
    // Connect socket when user logs in
    if (token) {
      socketService.connect(token, process.env.REACT_APP_API_URL || 'http://localhost:3000');
    } else {
      socketService.disconnect();
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [token]);

  // ... rest of auth logic
};
```

---

## Integration Examples

### 1. Requests List Component (Admin/Manager/Team)

```typescript
import React, { useState, useEffect } from 'react';
import { requestService, Request } from '../../services/services';
import { socketService, RequestCreatedPayload, RequestUpdatedPayload, RequestDeletedPayload } from '../../services/socketService';
import { useAuth } from '../../contexts/AuthContext';

export const RequestsList: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
    setupSocketListeners();

    return () => {
      // Cleanup socket listeners
      socketService.removeAllListeners();
    };
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Listen for new requests
    socketService.onRequestCreated((payload: RequestCreatedPayload) => {
      setRequests((prev) => [payload.request, ...prev]);
    });

    // Listen for request updates
    socketService.onRequestUpdated((payload: RequestUpdatedPayload) => {
      setRequests((prev) =>
        prev.map((req) =>
          req._id === payload.request._id ? payload.request : req
        )
      );
    });

    // Listen for request deletions
    socketService.onRequestDeleted((payload: RequestDeletedPayload) => {
      setRequests((prev) => prev.filter((req) => req._id !== payload.requestId));
    });
  };

  // ... rest of component
};
```

### 2. Student Requests Component (with Toast Notifications)

```typescript
import React, { useState, useEffect } from 'react';
import { requestService, Request } from '../../services/services';
import { socketService, UserRequestUpdatedPayload } from '../../services/socketService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify'; // or your toast library

export const StudentRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
    setupSocketListeners();

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getUserRequests(user?.id || '');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Listen for updates to student's own requests
    socketService.onUserRequestUpdated((payload: UserRequestUpdatedPayload) => {
      const { request } = payload;

      // Update the request in the list
      setRequests((prev) =>
        prev.map((req) =>
          req._id === request._id ? request : req
        )
      );

      // Show toast notification based on status
      if (request.status === 'resolved') {
        toast.success(`Your request has been resolved! ${request.adminNotes ? `Notes: ${request.adminNotes}` : ''}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      } else if (request.status === 'in-progress') {
        toast.info('Your request is now in progress!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.info('Your request has been updated.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    });
  };

  // ... rest of component
};
```

### 3. Request Details Component (Team Member)

```typescript
import React, { useState, useEffect } from 'react';
import { requestService, Request } from '../../services/services';
import { socketService, RequestResolvedPayload } from '../../services/socketService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

interface RequestDetailsProps {
  requestId: string;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({ requestId }) => {
  const { user } = useAuth();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequest();

    // Join request room if team member
    if (user?.role === 'team') {
      socketService.joinRequestRoom(requestId);
    }

    setupSocketListeners();

    return () => {
      // Leave request room
      if (user?.role === 'team') {
        socketService.leaveRequestRoom(requestId);
      }
      socketService.removeAllListeners();
    };
  }, [requestId]);

  const loadRequest = async () => {
    try {
      setLoading(true);
      const response = await requestService.getRequestById(requestId);
      setRequest(response.data);
    } catch (error) {
      console.error('Failed to load request:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Listen for request resolved (only for team members viewing this request)
    socketService.onRequestResolved((payload: RequestResolvedPayload) => {
      if (payload.request._id === requestId) {
        setRequest(payload.request);
        
        toast.warning('This request has been resolved!', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    });

    // Listen for general updates
    socketService.onRequestUpdated((payload) => {
      if (payload.request._id === requestId) {
        setRequest(payload.request);
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!request) {
    return <div>Request not found</div>;
  }

  return (
    <div>
      <h2>Request Details</h2>
      {/* Request details UI */}
    </div>
  );
};
```

---

## Role-Based Notifications

### Admin & Manager
- Receive all `request:created`, `request:updated`, `request:status_updated`, `request:deleted` events
- Automatically update their requests list
- No toast notifications (they manage requests, not receive updates)

### Team Members
- Receive all `request:created`, `request:updated`, `request:status_updated`, `request:deleted` events
- Automatically update their requests list
- Receive `request:resolved` toast when viewing a specific request that gets resolved

### Students
- Receive `user:request_updated` events for their own requests only
- Show toast notifications when their request status changes
- Automatically update their requests list

---

## Toast Notifications

### Using react-toastify

```bash
npm install react-toastify
```

```typescript
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// In your App.tsx
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      {/* Your app */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
```

### Toast Examples

```typescript
// Success toast
toast.success('Request resolved!', {
  position: 'top-right',
  autoClose: 5000,
});

// Info toast
toast.info('Request updated', {
  position: 'top-right',
  autoClose: 3000,
});

// Warning toast
toast.warning('Request resolved by another admin', {
  position: 'top-right',
  autoClose: 5000,
});

// Error toast
toast.error('Failed to update request', {
  position: 'top-right',
  autoClose: 3000,
});
```

---

## Best Practices

1. **Connection Management**
   - Connect socket when user logs in
   - Disconnect socket when user logs out
   - Handle reconnection automatically

2. **Memory Management**
   - Remove socket listeners when components unmount
   - Clean up request room joins when leaving pages

3. **Error Handling**
   - Handle socket connection errors gracefully
   - Fall back to polling if socket fails
   - Show user-friendly error messages

4. **Performance**
   - Update only affected requests in lists
   - Use optimistic updates where appropriate
   - Debounce rapid updates if needed

5. **User Experience**
   - Show loading states during initial connection
   - Display connection status indicator
   - Provide manual refresh option as fallback

---

## Testing Checklist

- [ ] Socket connects on login
- [ ] Socket disconnects on logout
- [ ] New requests appear in list automatically
- [ ] Request updates reflect immediately
- [ ] Students receive toast notifications
- [ ] Team members receive resolved notifications
- [ ] Request room joining/leaving works
- [ ] Reconnection works after disconnect
- [ ] Multiple tabs sync correctly
- [ ] Error handling works gracefully

---

## Summary

Socket.io integration provides:
- ✅ Real-time updates without page refresh
- ✅ Toast notifications for students
- ✅ Team member notifications for resolved requests
- ✅ Automatic list synchronization
- ✅ Role-based event filtering
- ✅ Request-specific rooms for team members

All users now receive instant updates when requests are created, updated, or deleted!

