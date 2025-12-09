# Frontend Pages Documentation

## 📋 Table of Contents

1. [Public Pages](#public-pages)
2. [Protected Pages](#protected-pages)
3. [Page Flow Diagrams](#page-flow-diagrams)

---

## 🌐 Public Pages

### Login.tsx
**Route**: `/login`

**Purpose**: User authentication

**Features**:
- Email and password input
- Form validation
- Error handling
- Redirect after login

**Flow**:
```
1. User enters credentials
2. Validates form
3. Calls authService.signIn()
4. On success:
   - Stores token
   - Updates AuthContext
   - Redirects to dashboard
5. On error:
   - Shows error message
   - Keeps user on login page
```

**State**:
```typescript
{
  email: string
  password: string
  loading: boolean
  error: string | null
}
```

---

## 🔒 Protected Pages

### Home.tsx
**Route**: `/`

**Purpose**: Landing page with quick actions

**Features**:
- Welcome message
- Quick action cards
- Feature highlights
- Navigation shortcuts

**Components Used**:
- Layout
- Action cards

---

### Dashboard.tsx
**Route**: `/dashboard`

**Purpose**: Analytics dashboard

**Access**: Admin, Manager, Team

**Features**:
- Statistics cards
- Category chart
- Status chart
- Daily trends chart
- Real-time updates

**Flow**:
```
1. Page loads
2. Fetches analytics data
3. Renders charts and statistics
4. Sets up Socket.io listeners
5. Updates on real-time events
```

**Hooks Used**:
- `useSocket` - Real-time updates
- `usePageTitle` - Page title

**Components Used**:
- StatisticsCards
- CategoryChart
- StatusChart
- DailyChart

---

### ServiceRequest.tsx
**Route**: `/request`

**Purpose**: Submit service request

**Access**: All authenticated users

**Features**:
- Request form
- Category selection
- File upload
- Form validation
- Success feedback

**Flow**:
```
1. User fills form
   - Selects category
   - Enters description
   - Optionally uploads file
2. Validates form
3. Submits via apiService.createRequest()
4. On success:
   - Shows success toast
   - Resets form
   - Optionally redirects
5. On error:
   - Shows error message
```

**State**:
```typescript
{
  category: string
  description: string
  studentName: string
  attachment: File | null
  loading: boolean
}
```

---

### RequestHistory.tsx
**Route**: `/history`

**Purpose**: View user's request history

**Access**: Students

**Features**:
- List of user's requests
- Status tracking
- Request details
- Chat access
- Filtering

**Flow**:
```
1. Page loads
2. Fetches user's requests via apiService.getUserRequests()
3. Renders request cards
4. User clicks request → Shows details
5. User clicks chat → Navigates to chat page
```

**Hooks Used**:
- `useRequests` - Request data management
- `useSocket` - Real-time updates

**Components Used**:
- RequestHistoryCard
- RequestHistoryHeader
- EmptyState

---

### RequestManagement.tsx
**Route**: `/requests`

**Purpose**: Manage all requests (admin/manager)

**Access**: Admin, Manager

**Features**:
- Request table
- Filters and search
- Status updates
- Request details
- Bulk actions

**Flow**:
```
1. Page loads
2. Fetches requests via apiService.getRequests()
3. Applies filters
4. Renders table
5. User actions:
   - Updates status → apiService.updateRequestStatus()
   - Views details → Opens modal
   - Deletes request → apiService.deleteRequest()
6. Real-time updates via Socket.io
```

**Hooks Used**:
- `useRequests` - Request data
- `useSocket` - Real-time updates

**Components Used**:
- RequestTable
- RequestFilters
- RequestDetailsModal
- UpdateRequestStatusModal

---

### TeamRequestsList.tsx
**Route**: `/team-requests`

**Purpose**: View and manage assigned requests

**Access**: Team

**Features**:
- Assigned requests list
- Status updates
- Request details
- Filtering

**Flow**:
```
1. Page loads
2. Fetches assigned requests
3. Renders request list
4. Team member updates status
5. Request updates in real-time
```

---

### Map.tsx
**Route**: `/map`

**Purpose**: View campus map

**Access**: All authenticated users

**Features**:
- Interactive map (Leaflet)
- Location markers
- Category filtering
- Marker details popup
- Map controls

**Flow**:
```
1. Page loads
2. Fetches markers via apiService.getCampusMarkers()
3. Initializes Leaflet map
4. Renders markers on map
5. User interactions:
   - Clicks marker → Shows popup
   - Filters by category → Updates markers
   - Zooms/pans map
```

**State**:
```typescript
{
  markers: CampusLocation[]
  selectedType: string
  map: L.Map | null
}
```

**Components Used**:
- MapContainer (React Leaflet)
- Marker components

---

### CampusMapManagement.tsx
**Route**: `/map-management`

**Purpose**: Manage map markers (admin)

**Access**: Admin

**Features**:
- Marker list
- Create marker
- Edit marker
- Delete marker
- Map preview

**Flow**:
```
1. Page loads
2. Fetches all markers
3. Renders marker list and map
4. Admin actions:
   - Creates marker → Opens CreateMarkerModal
   - Edits marker → Opens EditMarkerModal
   - Deletes marker → Confirms and deletes
5. Map updates with changes
```

**Components Used**:
- CreateMarkerModal
- DeleteMarkerModal
- Map components

---

### Announcements.tsx
**Route**: `/announcements`

**Purpose**: View announcements

**Access**: All authenticated users

**Features**:
- Announcement list
- Filtering by type
- Priority indicators
- Mark as read
- Unread count

**Flow**:
```
1. Page loads
2. Fetches announcements via apiService.getAnnouncements()
3. Renders announcement cards
4. User clicks announcement → Marks as read
5. Real-time updates for new announcements
```

**Hooks Used**:
- `useNotifications` - Unread count
- `useSocket` - Real-time updates

**Components Used**:
- AnnouncementsList
- AnnouncementCard
- AnnouncementsFilters

---

### UserManagement.tsx
**Route**: `/users`

**Purpose**: Manage users (admin/manager)

**Access**: Admin, Manager

**Features**:
- User table
- Create user
- Edit user
- Delete user
- User statistics
- Search and filter

**Flow**:
```
1. Page loads
2. Fetches users via apiService.getUsers()
3. Renders user table
4. Admin actions:
   - Creates user → Opens UserCreateEditModal
   - Edits user → Opens UserCreateEditModal (edit mode)
   - Deletes user → Confirms and deletes
5. Table updates
```

**Components Used**:
- UserTable
- UserCreateEditModal
- UserDetailsModal
- UserFilters
- UserStatsCards

---

### CategoryManagement.tsx
**Route**: `/categories`

**Purpose**: Manage request categories (admin/manager)

**Access**: Admin, Manager

**Features**:
- Category list
- Create category
- Edit category
- Activate/deactivate category
- Delete category

**Flow**:
```
1. Page loads
2. Fetches categories via apiService.getCategories()
3. Renders category cards
4. Admin actions:
   - Creates category → Opens CreateCategoryModal
   - Edits category → Opens EditCategoryModal
   - Toggles active status
   - Deletes category
```

**Components Used**:
- CategoryCard
- CreateCategoryModal
- EditCategoryModal
- DeleteConfirmationModal

---

### SystemConfig.tsx
**Route**: `/config`

**Purpose**: System configuration (admin)

**Access**: Admin only

**Features**:
- Project name management
- Logo upload
- Email domain whitelist
- AI system prompt

**Flow**:
```
1. Page loads
2. Fetches config via apiService.getSystemConfig()
3. Renders config sections
4. Admin updates:
   - Project name → apiService.updateProjectName()
   - Logo → apiService.updateLogo()
   - Email domains → apiService.add/removeEmailDomain()
   - AI prompt → apiService.updateSystemPrompt()
5. Config context refreshes
```

**Components Used**:
- ProjectNameSection
- LogoSection
- EmailDomainsSection
- SystemPromptManager

---

### Profile.tsx
**Route**: `/profile`

**Purpose**: User profile management

**Access**: All authenticated users

**Features**:
- Profile information display
- Edit profile form
- Change password (if implemented)
- Account settings

**Flow**:
```
1. Page loads
2. Fetches user profile via apiService.getUserProfile()
3. Renders profile form
4. User edits information
5. Submits form → apiService.updateUserProfile()
6. Updates AuthContext
```

**Components Used**:
- ProfileHeader
- ProfileForm
- AccountInfoCard

---

### Chat.tsx
**Route**: `/chat/:requestId`

**Purpose**: Chat for specific request

**Access**: Request participants

**Features**:
- Message history
- Send messages
- Real-time updates
- Typing indicators (if implemented)

**Flow**:
```
1. Page loads
2. Fetches chat messages via apiService.getChatMessages()
3. Connects to Socket.io room for request
4. Renders message list
5. User sends message:
   - Via Socket.io (real-time)
   - Via API (persistence)
6. Receives messages in real-time
7. Updates message list
```

**Hooks Used**:
- `useSocket` - Socket connection
- `useParams` - Get requestId from URL

---

### Unauthorized.tsx
**Route**: `/unauthorized`

**Purpose**: Unauthorized access page

**Access**: Public

**Features**:
- Error message
- Back to home button

---

## 🔄 Page Flow Diagrams

### Request Submission Flow

```
User → ServiceRequest Page
  ↓
Fills Form
  ↓
Submits Request
  ↓
API Call → Backend
  ↓
Request Created
  ↓
Socket.io Event
  ↓
Admin Dashboard Updates (Real-time)
  ↓
User Sees Success Message
```

### Request Management Flow

```
Admin → RequestManagement Page
  ↓
Views Requests
  ↓
Filters/Searches
  ↓
Updates Status
  ↓
API Call → Backend
  ↓
Status Updated
  ↓
Socket.io Event
  ↓
Student RequestHistory Updates (Real-time)
  ↓
Admin Dashboard Updates (Real-time)
```

### Announcement Flow

```
Admin → Announcements Page
  ↓
Creates Announcement
  ↓
API Call → Backend
  ↓
Announcement Created
  ↓
Socket.io Event (to all users)
  ↓
All Users' Announcements Page Updates (Real-time)
  ↓
Unread Count Updates
```

---

## 🎯 Page Best Practices

1. **Data Fetching**: Fetch data on mount using `useEffect`
2. **Loading States**: Show loading indicators during data fetch
3. **Error Handling**: Handle errors gracefully with user feedback
4. **Real-time Updates**: Use Socket.io hooks for live updates
5. **Route Protection**: Use ProtectedRoute wrapper
6. **Page Titles**: Use `usePageTitle` hook
7. **Cleanup**: Clean up subscriptions and listeners on unmount

---

## 📚 Next Steps

- [Frontend Hooks](./FRONTEND_HOOKS.md) - Custom hooks documentation
- [Frontend Services](./FRONTEND_SERVICES.md) - Service layer documentation
- [Integration Guide](./INTEGRATION_GUIDE.md) - How everything connects

