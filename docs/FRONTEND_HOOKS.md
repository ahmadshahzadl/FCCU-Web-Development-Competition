# Frontend Hooks Documentation

## 📋 Table of Contents

1. [Socket Hooks](#socket-hooks)
2. [Data Hooks](#data-hooks)
3. [Utility Hooks](#utility-hooks)

---

## 🔌 Socket Hooks

### useSocket.ts
**Purpose**: Manage Socket.io connection

**Returns**:
```typescript
{
  socket: Socket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}
```

**Usage**:
```typescript
const { socket, isConnected } = useSocket();
```

**Flow**:
```
1. Hook initializes
2. Connects to Socket.io server
3. Authenticates with JWT token
4. Sets up event listeners
5. Returns socket instance
6. Cleans up on unmount
```

**Features**:
- Automatic connection on mount
- JWT authentication
- Reconnection handling
- Connection state tracking

---

### useStudentSocket.ts
**Purpose**: Student-specific Socket.io events

**Returns**:
```typescript
{
  onRequestUpdate: (callback) => void
  onAnnouncement: (callback) => void
}
```

**Usage**:
```typescript
const { onRequestUpdate } = useStudentSocket();

useEffect(() => {
  onRequestUpdate((data) => {
    // Handle request update
  });
}, []);
```

**Events Listened**:
- `request:updated` - Request status changes
- `announcement:created` - New announcements

**Flow**:
```
1. Connects to Socket.io
2. Joins student-specific rooms
3. Sets up event listeners
4. Calls callbacks on events
5. Cleans up on unmount
```

---

### useTeamSocket.ts
**Purpose**: Team-specific Socket.io events

**Returns**:
```typescript
{
  onRequestAssigned: (callback) => void
  onRequestUpdate: (callback) => void
}
```

**Usage**:
```typescript
const { onRequestAssigned } = useTeamSocket();

useEffect(() => {
  onRequestAssigned((data) => {
    // Handle new assignment
  });
}, []);
```

**Events Listened**:
- `request:created` - New requests (if assigned)
- `request:updated` - Request updates

---

## 📊 Data Hooks

### useRequests.ts
**Purpose**: Manage request data and operations

**Returns**:
```typescript
{
  requests: ServiceRequest[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  createRequest: (data) => Promise<ServiceRequest>
  updateRequest: (id, data) => Promise<ServiceRequest>
  deleteRequest: (id) => Promise<void>
}
```

**Usage**:
```typescript
const { requests, loading, createRequest } = useRequests({
  status: 'pending',
  category: 'maintenance'
});

// Create request
await createRequest({
  category: 'maintenance',
  description: 'AC not working'
});
```

**Features**:
- Automatic data fetching
- Filtering support
- Real-time updates via Socket.io
- CRUD operations
- Loading and error states

**Flow**:
```
1. Hook initializes with filters
2. Fetches requests from API
3. Sets up Socket.io listeners
4. Updates requests on events
5. Provides CRUD methods
6. Refetches on filter change
```

---

### useNotifications.ts
**Purpose**: Manage notifications

**Returns**:
```typescript
{
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id) => Promise<void>
  deleteNotification: (id) => Promise<void>
  refreshNotifications: () => Promise<void>
}
```

**Usage**:
```typescript
const { unreadCount, markAsRead } = useNotifications();

// Mark notification as read
await markAsRead(notificationId);
```

**Features**:
- Fetches notifications
- Tracks unread count
- Real-time updates
- Mark as read functionality
- Delete notifications

**Flow**:
```
1. Hook initializes
2. Fetches notifications from API
3. Calculates unread count
4. Sets up Socket.io listeners
5. Updates on new notifications
6. Provides action methods
```

---

## 🛠️ Utility Hooks

### usePageTitle.ts
**Purpose**: Set page title dynamically

**Returns**: None (side effect hook)

**Usage**:
```typescript
usePageTitle('Dashboard');
```

**Features**:
- Sets document title
- Updates on title change
- Restores default on unmount

**Flow**:
```
1. Hook called with title
2. Sets document.title
3. On unmount, restores default
```

---

## 🔄 Hook Patterns

### Data Fetching Pattern

```typescript
const useData = (filters) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getData(filters);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
};
```

### Socket Pattern

```typescript
const useSocketEvents = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleEvent = (data) => {
      // Handle event
    };

    socket.on('event', handleEvent);

    return () => {
      socket.off('event', handleEvent);
    };
  }, [socket]);
};
```

---

## 📚 Hook Best Practices

1. **Single Responsibility**: Each hook has one clear purpose
2. **Cleanup**: Always clean up subscriptions and listeners
3. **Dependencies**: Properly manage useEffect dependencies
4. **Error Handling**: Handle errors gracefully
5. **Loading States**: Provide loading indicators
6. **Type Safety**: Use TypeScript for type safety
7. **Reusability**: Make hooks reusable across components

---

## 🎯 Next Steps

- [Frontend Services](./FRONTEND_SERVICES.md) - Service layer documentation
- [Integration Guide](./INTEGRATION_GUIDE.md) - How everything connects

