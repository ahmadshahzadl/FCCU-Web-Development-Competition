# Campus Helper Platform - Frontend

This is the frontend application for the Campus Helper Platform, built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

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
│   │   ├── Layout/         # Layout components (Navbar, Sidebar)
│   │   └── Chatbot/        # AI Chatbot component
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── ServiceRequest.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Map.tsx
│   │   ├── Announcements.tsx
│   │   ├── RequestHistory.tsx
│   │   ├── Analytics.tsx
│   │   └── Chat.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useSocket.ts
│   │   ├── useNotifications.ts
│   │   └── useRequests.ts
│   ├── services/           # API and service integrations
│   │   ├── api.ts          # REST API service
│   │   └── socket.ts       # Socket.io service
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── helpers.ts
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 🛠️ Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## 📝 Features

- ✅ Service Request Submission
- ✅ Admin Dashboard
- ✅ Campus Map with Markers
- ✅ Announcements Board
- ✅ Request History
- ✅ Real-time Chat
- ✅ Analytics Dashboard
- ✅ AI Campus Assistant (Chatbot)
- ✅ Real-time Notifications

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)
- `VITE_SOCKET_URL` - Socket.io server URL (default: http://localhost:3000)

### Path Aliases

The project uses path aliases for cleaner imports:
- `@/` - Points to `src/`

Example:
```typescript
import { apiService } from '@/services/api';
import type { ServiceRequest } from '@/types';
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

## 🔌 API Integration

All API calls are handled through the `apiService` in `src/services/api.ts`. The service includes:

- Request interceptors for authentication
- Response interceptors for error handling
- Type-safe API methods
- Automatic token management

## 🔄 Real-time Features

Real-time features use Socket.io and are managed through `socketService` in `src/services/socket.ts`:

- Real-time chat messages
- Request status updates
- Notifications
- Typing indicators

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

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

## 📄 License

MIT

