# Campus Helper Platform - Frontend

A comprehensive campus management platform built with React, TypeScript, and modern web technologies. This frontend application provides a user-friendly interface for managing service requests, campus maps, announcements, and analytics.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm**, **yarn**, or **pnpm** package manager
- Backend API server running (see backend repository)

### Installation

1. Navigate to the frontend directory:
```bash
cd codes/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file in the frontend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API URL:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
# or
yarn build
# or
pnpm build
```

The production build will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Analytics/       # Analytics charts and statistics
│   │   ├── Announcements/   # Announcement components
│   │   ├── CampusMap/       # Campus map marker modals
│   │   ├── CategoryManagement/ # Category management modals
│   │   ├── Chatbot/         # AI Chatbot component
│   │   ├── Layout/          # Layout components (Navbar, Sidebar)
│   │   ├── Profile/         # User profile components
│   │   ├── RequestHistory/  # Request history components
│   │   ├── RequestManagement/ # Request management components
│   │   ├── SystemConfig/    # System configuration components
│   │   ├── TeamRequests/    # Team request components
│   │   └── UserManagement/  # User management components
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx  # Authentication context
│   │   ├── ThemeContext.tsx # Theme (dark/light mode) context
│   │   ├── SystemConfigContext.tsx # System configuration context
│   │   └── AnnouncementContext.tsx # Announcements context
│   ├── hooks/               # Custom React hooks
│   │   ├── useSocket.ts     # Socket.io hook
│   │   ├── useStudentSocket.ts # Student-specific socket hook
│   │   ├── useTeamSocket.ts # Team-specific socket hook
│   │   ├── useNotifications.ts # Notifications hook
│   │   ├── useRequests.ts   # Request management hook
│   │   └── usePageTitle.ts  # Page title hook
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Home page
│   │   ├── Login.tsx        # Login page
│   │   ├── Dashboard.tsx    # Analytics dashboard
│   │   ├── ServiceRequest.tsx # Service request submission
│   │   ├── RequestHistory.tsx # Request history (students)
│   │   ├── RequestManagement.tsx # Request management (admin/manager)
│   │   ├── TeamRequestsList.tsx # Team requests page
│   │   ├── Map.tsx          # Campus map viewer
│   │   ├── CampusMapManagement.tsx # Campus map admin management
│   │   ├── Announcements.tsx # Announcements page
│   │   ├── Chat.tsx         # Chat support (under construction)
│   │   ├── UserManagement.tsx # User management (admin/manager)
│   │   ├── CategoryManagement.tsx # Category management
│   │   ├── SystemConfig.tsx # System configuration
│   │   ├── Profile.tsx      # User profile
│   │   └── Unauthorized.tsx # Unauthorized access page
│   ├── services/            # API and service integrations
│   │   ├── api.client.ts    # Axios client with interceptors
│   │   ├── api.ts           # REST API service methods
│   │   ├── auth.service.ts  # Authentication service
│   │   └── socket.ts        # Socket.io service
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # All type definitions
│   ├── utils/               # Utility functions
│   │   ├── helpers.ts       # General helper functions
│   │   ├── storage.ts       # Local storage utilities
│   │   ├── token.ts         # Token management
│   │   └── auth.helpers.ts  # Authentication helpers
│   ├── App.tsx              # Main App component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and Tailwind utilities
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## 🛠️ Technologies Used

- **React 19** - Modern UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time communication
- **React Leaflet** - Interactive maps with Leaflet
- **Leaflet** - Open-source JavaScript library for mobile-friendly interactive maps
- **Recharts** - Composable charting library
- **Chart.js** - Simple yet flexible charting library
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Beautiful icon library

## 📝 Features

### Core Features

- ✅ **Service Request Management**
  - Submit service requests with attachments
  - Track request status in real-time
  - View request history (students)
  - Manage requests (admin/manager/team)

- ✅ **Campus Map**
  - Interactive map with Leaflet
  - View campus locations and markers
  - Filter markers by category
  - Marker details with contact information
  - Admin marker management (CRUD operations)

- ✅ **Announcements System**
  - View announcements
  - Create announcements (admin/manager)
  - Filter by type and priority
  - Unread count badges
  - Real-time updates

- ✅ **Analytics Dashboard**
  - Comprehensive statistics for admin/manager
  - Public stats for team role
  - Charts and visualizations
  - Request trends and category breakdowns
  - Resolution rate tracking

- ✅ **User Management**
  - User CRUD operations (admin/manager)
  - Role-based access control
  - User statistics and filtering
  - Email domain validation

- ✅ **Category Management**
  - Create and manage request categories
  - Category icons and descriptions
  - Active/inactive status

- ✅ **System Configuration**
  - Project name and logo management
  - Email domain whitelist
  - AI system prompt configuration

- ✅ **Real-time Features**
  - Real-time request status updates
  - Socket.io integration
  - Live notifications
  - Request update toasts

- ✅ **AI Campus Assistant**
  - AI-powered chatbot
  - Context-aware responses
  - Help with campus queries

### Role-Based Access

The platform supports multiple user roles with different permissions:

- **Student**: Submit requests, view history, view map, announcements
- **Team**: View and manage assigned requests, view dashboard with public stats
- **Manager**: Full request management, user management, category management, analytics
- **Admin**: Full system access including system configuration and AI prompt management

## 🎨 UI/UX Features

- **Dark Mode Support** - Full dark mode with smooth transitions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Accessibility** - ARIA labels and keyboard navigation
- **Toast Notifications** - Beautiful, non-intrusive notifications
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Modal System** - Consistent modal design with backdrop blur
- **Form Validation** - Real-time validation with helpful messages

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### Path Aliases

The project uses path aliases for cleaner imports:
- `@/` - Points to `src/`

Example:
```typescript
import { apiService } from '@/services/api';
import type { ServiceRequest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

The project uses Tailwind CSS for styling. Custom utility classes are defined in `src/index.css`:

- `.btn` - Base button styles
- `.btn-primary` - Primary button variant
- `.btn-secondary` - Secondary button variant
- `.btn-danger` - Danger button variant
- `.input` - Input field styles
- `.card` - Card container styles
- `.badge` - Badge/status indicator styles

### Dark Mode

Dark mode is implemented using Tailwind's dark mode classes and a custom ThemeContext. The theme preference is stored in localStorage and persists across sessions.

## 🔌 API Integration

All API calls are handled through the `apiService` in `src/services/api.ts`. The service includes:

- Request interceptors for authentication
- Response interceptors for error handling
- Type-safe API methods
- Automatic token management
- Centralized error handling

### API Client

The `api.client.ts` provides a centralized Axios instance with:
- Automatic token injection
- Request/response interceptors
- Error handling
- Type-safe responses

## 🔄 Real-time Features

Real-time features use Socket.io and are managed through `socketService` in `src/services/socket.ts`:

- Real-time request status updates
- Live notifications
- Request update toasts
- Role-specific socket hooks

## 🗺️ Campus Map Integration

The campus map feature uses React Leaflet for interactive maps:

- **Marker Icons**: Uses CDN-hosted Leaflet icons to prevent 404 errors
- **Map Features**: Zoom, pan, marker popups, category filtering
- **Admin Management**: Full CRUD operations for map markers
- **Marker Details**: Contact info, opening hours, addresses

### Leaflet Configuration

Marker icons are configured using CDN URLs to ensure proper loading:
```typescript
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1024px+) - Full feature set with sidebar navigation
- **Tablet** (768px - 1023px) - Optimized layout with collapsible sidebar
- **Mobile** (< 768px) - Mobile-first design with bottom navigation

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes
- Automatic token refresh
- Secure token storage

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. You can also specify a port in `vite.config.ts`:

```typescript
server: {
  port: 3001, // Your preferred port
}
```

### API Connection Issues

Make sure:
1. Backend server is running
2. `VITE_API_URL` in `.env` matches your backend URL
3. CORS is properly configured on the backend

### Socket Connection Issues

Ensure:
1. Socket.io server is running on the backend
2. `VITE_SOCKET_URL` in `.env` is correct
3. Backend Socket.io is properly configured

### Map Container Initialization Error

If you encounter "Map container is already initialized" error:
- This is typically caused by React 18 StrictMode double-mounting
- The issue is handled in the Map component using unique keys
- If the error persists, clear browser cache and reload

### Marker Icons Not Showing

If marker icons show as broken images:
- The project uses CDN URLs for Leaflet icons
- Check your internet connection
- Verify CDN URLs are accessible
- Icons are configured in `src/pages/Map.tsx`

## 🧪 Development Tips

1. **Hot Module Replacement**: Vite provides instant HMR for fast development
2. **TypeScript**: Use TypeScript for type safety and better IDE support
3. **ESLint**: Run `npm run lint` before committing to catch errors
4. **Component Structure**: Follow the existing component structure for consistency
5. **API Service**: Always use `apiService` for API calls, never direct Axios calls

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on the repository.
