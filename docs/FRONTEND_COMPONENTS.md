# Frontend Components Documentation

## 📋 Table of Contents

1. [Layout Components](#layout-components)
2. [Request Components](#request-components)
3. [Analytics Components](#analytics-components)
4. [Announcement Components](#announcement-components)
5. [User Management Components](#user-management-components)
6. [Map Components](#map-components)
7. [System Components](#system-components)
8. [Common Components](#common-components)

---

## 🎨 Layout Components

### Layout.tsx
**Purpose**: Main application layout wrapper

**Features**:
- Provides consistent layout structure
- Includes Navbar and Sidebar
- Manages responsive layout

**Props**: `children: ReactNode`

**Usage**:
```typescript
<Layout>
  <YourPage />
</Layout>
```

---

### Navbar.tsx
**Purpose**: Top navigation bar

**Features**:
- Application logo and title
- Navigation links
- Mobile menu toggle
- Responsive design

**State**:
- `mobileMenuOpen: boolean`

**Flow**:
```
User clicks menu → Toggle mobileMenuOpen → Show/hide mobile menu
```

---

### Sidebar.tsx
**Purpose**: Side navigation menu

**Features**:
- Navigation links with icons
- Active route highlighting
- Role-based menu items
- Collapsible on mobile

**Props**: None (uses `useLocation` hook)

**Menu Items**:
- Home
- Submit Request
- Dashboard
- Campus Map
- Announcements
- Request History
- Analytics
- User Management (admin/manager)
- Category Management (admin/manager)
- System Config (admin)

---

## 📋 Request Components

### RequestManagement/

#### RequestTable.tsx
**Purpose**: Display requests in table format

**Features**:
- Sortable columns
- Filterable rows
- Status badges
- Action buttons
- Pagination

**Props**:
```typescript
{
  requests: ServiceRequest[]
  loading: boolean
  onStatusUpdate: (id, status) => void
  onDelete: (id) => void
  onView: (id) => void
}
```

**Flow**:
```
1. Receives requests array
2. Renders table rows
3. User clicks action → Calls callback
4. Parent component handles action
```

---

#### RequestFilters.tsx
**Purpose**: Filter requests by various criteria

**Features**:
- Status filter
- Category filter
- Date range filter
- Search by description
- Clear filters

**Props**:
```typescript
{
  filters: FilterState
  onFilterChange: (filters) => void
  categories: Category[]
}
```

**State**:
```typescript
{
  status: string
  category: string
  search: string
  dateFrom: Date
  dateTo: Date
}
```

---

#### RequestDetailsModal.tsx
**Purpose**: Show detailed request information

**Features**:
- Request details display
- Status history
- Admin notes
- Attachment preview
- Action buttons

**Props**:
```typescript
{
  request: ServiceRequest
  isOpen: boolean
  onClose: () => void
  onUpdate: (id, data) => void
}
```

---

#### UpdateRequestStatusModal.tsx
**Purpose**: Update request status

**Features**:
- Status dropdown
- Admin notes input
- Validation
- Submit handler

**Props**:
```typescript
{
  request: ServiceRequest
  isOpen: boolean
  onClose: () => void
  onUpdate: (id, status, notes) => Promise<void>
}
```

**Flow**:
```
1. User selects new status
2. Optionally adds admin notes
3. Clicks submit
4. Calls onUpdate callback
5. Parent component updates request via API
6. Modal closes
```

---

### RequestHistory/

#### RequestHistoryCard.tsx
**Purpose**: Display request in card format (for students)

**Features**:
- Request summary
- Status badge
- Category badge
- Timestamps
- Chat button

**Props**:
```typescript
{
  request: ServiceRequest
  onChatClick: (requestId) => void
}
```

---

#### RequestHistoryHeader.tsx
**Purpose**: Header for request history page

**Features**:
- Page title
- Statistics
- Filter options

---

## 📊 Analytics Components

### StatisticsCards.tsx
**Purpose**: Display key statistics

**Features**:
- Total requests card
- Active requests card
- Resolved requests card
- Average resolution time card

**Props**:
```typescript
{
  statistics: {
    totalRequests: number
    activeRequests: number
    resolvedRequests: number
    averageResolutionTime: number
  }
}
```

---

### CategoryChart.tsx
**Purpose**: Display category distribution chart

**Features**:
- Pie chart (Recharts)
- Category breakdown
- Percentage display

**Props**:
```typescript
{
  data: CategoryStats[]
}
```

**Flow**:
```
1. Receives category statistics
2. Formats data for Recharts
3. Renders pie chart
4. Shows tooltip on hover
```

---

### StatusChart.tsx
**Purpose**: Display status distribution chart

**Features**:
- Bar chart (Recharts)
- Status breakdown
- Count display

**Props**:
```typescript
{
  data: StatusStats[]
}
```

---

### DailyChart.tsx
**Purpose**: Display daily request trends

**Features**:
- Line chart (Recharts)
- Time series data
- Date range selection

**Props**:
```typescript
{
  data: TrendData[]
  dateRange: { start: Date, end: Date }
}
```

---

## 📢 Announcement Components

### AnnouncementsList.tsx
**Purpose**: Display list of announcements

**Features**:
- Announcement cards
- Filtering
- Sorting
- Pagination

**Props**:
```typescript
{
  announcements: Announcement[]
  filters: AnnouncementFilters
  onFilterChange: (filters) => void
}
```

---

### AnnouncementCard.tsx
**Purpose**: Display single announcement

**Features**:
- Title and content
- Type badge
- Priority badge
- Timestamp
- Read/unread indicator

**Props**:
```typescript
{
  announcement: Announcement
  isRead: boolean
  onMarkAsRead: (id) => void
}
```

---

### CreateAnnouncementModal.tsx
**Purpose**: Create new announcement

**Features**:
- Form fields (title, content, type, priority)
- Target audience selection
- Validation
- Submit handler

**Props**:
```typescript
{
  isOpen: boolean
  onClose: () => void
  onSubmit: (data) => Promise<void>
}
```

**Flow**:
```
1. User fills form
2. Validates input
3. Submits form
4. Calls onSubmit callback
5. Parent component creates announcement via API
6. Modal closes
7. Announcement list refreshes
```

---

## 👥 User Management Components

### UserTable.tsx
**Purpose**: Display users in table format

**Features**:
- User list with details
- Role badges
- Status indicators
- Action buttons
- Search and filter

**Props**:
```typescript
{
  users: User[]
  loading: boolean
  onEdit: (user) => void
  onDelete: (id) => void
  onView: (id) => void
}
```

---

### UserCreateEditModal.tsx
**Purpose**: Create or edit user

**Features**:
- Form fields (email, username, name, role)
- Password field (for new users)
- Email domain validation
- Role selection
- Validation

**Props**:
```typescript
{
  isOpen: boolean
  user?: User (for edit mode)
  onClose: () => void
  onSubmit: (data) => Promise<void>
}
```

**Flow**:
```
1. Opens in create or edit mode
2. Pre-fills form if editing
3. User fills/edits form
4. Validates input
5. Submits form
6. Calls onSubmit callback
7. Parent component creates/updates user via API
8. Modal closes
9. User list refreshes
```

---

### UserDetailsModal.tsx
**Purpose**: Show detailed user information

**Features**:
- User profile display
- Role information
- Statistics
- Activity history

**Props**:
```typescript
{
  user: User
  isOpen: boolean
  onClose: () => void
}
```

---

## 🗺️ Map Components

### CreateMarkerModal.tsx
**Purpose**: Create new map marker

**Features**:
- Form fields (name, type, coordinates, description)
- Map picker for coordinates
- Category selection
- Validation

**Props**:
```typescript
{
  isOpen: boolean
  onClose: () => void
  onSubmit: (data) => Promise<void>
}
```

**Flow**:
```
1. User fills marker form
2. Clicks on map to set coordinates
3. Validates input
4. Submits form
5. Calls onSubmit callback
6. Parent component creates marker via API
7. Modal closes
8. Map refreshes with new marker
```

---

### DeleteMarkerModal.tsx
**Purpose**: Confirm marker deletion

**Features**:
- Confirmation message
- Marker details
- Delete button

**Props**:
```typescript
{
  marker: CampusLocation
  isOpen: boolean
  onClose: () => void
  onConfirm: (id) => Promise<void>
}
```

---

## ⚙️ System Components

### SystemConfig/

#### ProjectNameSection.tsx
**Purpose**: Update project name

**Features**:
- Current name display
- Edit form
- Save button

**Flow**:
```
1. Displays current project name
2. User clicks edit
3. Shows input field
4. User enters new name
5. Clicks save
6. Updates via API
7. Refreshes config context
```

---

#### LogoSection.tsx
**Purpose**: Update project logo

**Features**:
- Current logo display
- Upload form
- Image preview
- Save button

**Flow**:
```
1. Displays current logo
2. User selects image file
3. Shows preview
4. Clicks upload
5. Uploads via API
6. Updates logo URL
7. Refreshes config context
```

---

#### EmailDomainsSection.tsx
**Purpose**: Manage email domain whitelist

**Features**:
- List of domains
- Add domain form
- Remove domain button

**Flow**:
```
1. Displays current domains
2. User adds domain → Calls API
3. Domain added to list
4. User removes domain → Calls API
5. Domain removed from list
```

---

### SystemPrompt/

#### SystemPromptManager.tsx
**Purpose**: Manage AI system prompt

**Features**:
- Current prompt display
- Edit form (textarea)
- Save button
- Preview

**Flow**:
```
1. Fetches current prompt from API
2. Displays in textarea
3. User edits prompt
4. Clicks save
5. Updates via API
6. Shows success message
```

---

## 🤖 Chatbot Component

### Chatbot.tsx
**Purpose**: AI-powered campus assistant

**Features**:
- Chat interface
- Message history
- AI responses
- Loading states
- Error handling

**State**:
```typescript
{
  isOpen: boolean
  messages: Message[]
  input: string
  loading: boolean
}
```

**Flow**:
```
1. User opens chatbot
2. Types message
3. Sends message → API call
4. Shows loading state
5. Receives AI response
6. Displays response
7. Adds to message history
```

**API Integration**:
```typescript
POST /api/ai/chat
Body: { message: string }
Response: { message: string }
```

---

## 🎨 Common Components

### ProtectedRoute.tsx
**Purpose**: Route protection wrapper

**Features**:
- Authentication check
- Role-based access control
- Redirect handling

**Props**:
```typescript
{
  path: string
  component: React.ComponentType
  requiredRole?: string[]
}
```

**Flow**:
```
1. Checks if user is authenticated
2. If not → Redirect to /login
3. If authenticated, checks role
4. If role not allowed → Redirect to /unauthorized
5. If allowed → Render component
```

---

### Form Components

#### EmailInputWithDomain.tsx
**Purpose**: Email input with domain validation

**Features**:
- Email input field
- Domain validation
- Error messages
- Domain suggestions

**Props**:
```typescript
{
  value: string
  onChange: (value) => void
  allowedDomains: string[]
  error?: string
}
```

---

## 🔄 Component Communication Flow

### Parent-Child Communication

```
Parent Component
  ↓ (props)
Child Component
  ↓ (callbacks)
Parent Component
  ↓ (state update)
Re-render
```

### Context Communication

```
Component
  ↓ (useContext)
Context Provider
  ↓ (state)
All Subscribed Components
```

### Service Communication

```
Component
  ↓ (apiService)
API Service
  ↓ (HTTP)
Backend API
  ↓ (response)
Component (state update)
```

---

## 📚 Component Best Practices

1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: Define clear TypeScript interfaces
3. **State Management**: Use local state for UI, context for global state
4. **Error Handling**: Handle errors gracefully with user feedback
5. **Loading States**: Show loading indicators during async operations
6. **Accessibility**: Use ARIA labels and keyboard navigation
7. **Responsive Design**: Ensure components work on all screen sizes

---

## 🎯 Next Steps

- [Frontend Pages](./FRONTEND_PAGES.md) - Page component documentation
- [Frontend Hooks](./FRONTEND_HOOKS.md) - Custom hooks documentation
- [Frontend Services](./FRONTEND_SERVICES.md) - Service layer documentation

