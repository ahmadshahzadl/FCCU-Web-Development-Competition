# 🎓 Frontend Codebase Setup Guide

Complete step-by-step guide to create and set up the frontend codebase for the Campus Helper Platform.

## 📋 Overview

This guide will walk you through creating a complete React + TypeScript + Vite frontend application with all the features specified in the documentation.

---

## ✅ Step-by-Step Instructions

### Step 1: Initialize Project Structure

1. **Navigate to the frontend directory:**
   ```bash
   cd codes/frontend
   ```

2. **Verify the directory is empty or create it:**
   ```bash
   # If directory doesn't exist
   mkdir -p codes/frontend
   cd codes/frontend
   ```

---

### Step 2: Create Configuration Files

The following configuration files have been created:

#### 2.1 `package.json`
- Contains all project dependencies
- Defines npm scripts (dev, build, preview, lint)
- Includes React, TypeScript, Vite, Tailwind CSS, and all required libraries

#### 2.2 `vite.config.ts`
- Vite configuration with React plugin
- Path alias setup (`@/` → `src/`)
- Proxy configuration for API calls
- Development server settings

#### 2.3 `tsconfig.json`
- TypeScript compiler configuration
- Strict type checking enabled
- Path aliases configured
- React JSX support

#### 2.4 `tailwind.config.js`
- Tailwind CSS configuration
- Custom color palette (primary colors)
- Content paths for purging unused styles

#### 2.5 `postcss.config.js`
- PostCSS configuration for Tailwind CSS
- Autoprefixer setup

#### 2.6 `index.html`
- HTML template with Leaflet CSS link
- Root div for React app
- Script tag for main.tsx

#### 2.7 `.eslintrc.cjs`
- ESLint configuration
- TypeScript and React rules
- Code quality checks

---

### Step 3: Install Dependencies

Run the following command to install all dependencies:

```bash
npm install
```

**This will install:**
- React 18.2.0
- React DOM 18.2.0
- TypeScript 5.2.2
- Vite 5.0.8
- Tailwind CSS 3.3.6
- React Router DOM 6.20.0
- Axios 1.6.2
- Socket.io Client 4.5.4
- React Leaflet 4.2.1
- Recharts 2.10.3
- React Hot Toast 2.4.1
- Lucide React 0.294.0
- And all dev dependencies

**Expected output:**
```
added 500+ packages, and audited 500+ packages in 30s
```

---

### Step 4: Create Source Code Structure

The following directory structure has been created:

```
src/
├── components/          # Reusable components
│   ├── Layout/         # Layout components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── Chatbot/        # AI Chatbot
│       └── Chatbot.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── ServiceRequest.tsx
│   ├── Dashboard.tsx
│   ├── Map.tsx
│   ├── Announcements.tsx
│   ├── RequestHistory.tsx
│   ├── Analytics.tsx
│   └── Chat.tsx
├── hooks/              # Custom React hooks
│   ├── useSocket.ts
│   ├── useNotifications.ts
│   └── useRequests.ts
├── services/           # API and services
│   ├── api.ts          # REST API service
│   └── socket.ts       # Socket.io service
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
│   └── helpers.ts
├── App.tsx             # Main App component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

---

### Step 5: Set Up Environment Variables

1. **Create `.env` file:**
   ```bash
   # Windows PowerShell
   New-Item -Path .env -ItemType File
   
   # Linux/Mac
   touch .env
   ```

2. **Add environment variables:**
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_SOCKET_URL=http://localhost:3000
   ```

3. **Note:** Update these URLs if your backend runs on different ports.

---

### Step 6: Verify File Creation

Verify all files have been created correctly:

```bash
# Check main files exist
ls package.json
ls vite.config.ts
ls tsconfig.json
ls tailwind.config.js

# Check source directory
ls -R src/
```

---

### Step 7: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

### Step 8: Verify Application

1. **Open browser:** Navigate to `http://localhost:5173`

2. **Check for errors:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Test navigation:**
   - Click through different pages
   - Verify routing works
   - Check responsive design (resize window)

---

## 🎯 Features Implemented

### ✅ Core Features

1. **Service Request System**
   - Form with category selection
   - File upload support
   - Request submission
   - Status tracking

2. **Admin Dashboard**
   - Request listing
   - Status management
   - Search and filtering
   - Real-time updates

3. **Campus Map**
   - Interactive Leaflet map
   - Location markers
   - Category filtering
   - Popup information

4. **Announcements Board**
   - Announcement listing
   - Type filtering
   - Priority indicators
   - Date display

5. **Request History**
   - User's request list
   - Status tracking
   - Timeline view
   - Chat integration

6. **Analytics Dashboard**
   - Overview statistics
   - Category charts
   - Trend analysis
   - Performance metrics

7. **Real-time Chat**
   - Socket.io integration
   - Message history
   - Real-time updates
   - Typing indicators

8. **AI Chatbot**
   - OpenAI integration
   - Campus-specific responses
   - Chat interface
   - Error handling

---

## 🔧 Configuration Details

### Path Aliases

Import paths use `@/` alias:
```typescript
import { apiService } from '@/services/api';
import type { ServiceRequest } from '@/types';
import { formatDate } from '@/utils/helpers';
```

### API Service

All API calls go through `apiService`:
- Automatic authentication headers
- Error handling
- Type-safe responses
- Request/response interceptors

### Socket Service

Real-time features use `socketService`:
- Automatic reconnection
- Room-based messaging
- Event listeners
- Typing indicators

---

## 📦 Build for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

3. **Output:** Production files in `dist/` directory

---

## 🐛 Troubleshooting

### Issue: Dependencies not installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: TypeScript errors

**Solution:**
- Check `tsconfig.json` is correct
- Verify all type definitions are imported
- Run `npm run build` to see all errors

### Issue: Tailwind styles not working

**Solution:**
- Verify `tailwind.config.js` content paths
- Check `postcss.config.js` exists
- Ensure `index.css` imports Tailwind directives
- Restart dev server

### Issue: API connection failed

**Solution:**
1. Verify backend is running
2. Check `.env` file has correct URLs
3. Verify CORS is enabled on backend
4. Check browser console for specific errors

### Issue: Socket.io not connecting

**Solution:**
1. Verify Socket.io server is running
2. Check `VITE_SOCKET_URL` in `.env`
3. Verify Socket.io is configured on backend
4. Check browser console for connection errors

---

## 📝 Next Steps

1. **Backend Integration:**
   - Ensure backend API is running
   - Test all API endpoints
   - Verify Socket.io server is active

2. **Database Setup:**
   - Connect MongoDB
   - Verify database connection
   - Test data persistence

3. **Environment Configuration:**
   - Set up production environment variables
   - Configure API URLs for production
   - Set up SSL certificates if needed

4. **Testing:**
   - Test all features end-to-end
   - Verify real-time updates work
   - Test file uploads
   - Verify map functionality

5. **Deployment:**
   - Build production bundle
   - Deploy to hosting service (Vercel, Netlify, etc.)
   - Configure environment variables on hosting platform

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Socket.io Client Documentation](https://socket.io/docs/v4/client-api/)

---

## ✅ Checklist

- [x] Project structure created
- [x] Configuration files set up
- [x] Dependencies installed
- [x] Source code files created
- [x] Environment variables configured
- [x] Development server running
- [x] All pages implemented
- [x] API service integrated
- [x] Socket.io service integrated
- [x] Routing configured
- [x] Styling with Tailwind CSS
- [x] TypeScript types defined
- [x] Utility functions created
- [x] Custom hooks implemented
- [x] Components created
- [x] Documentation written

---

## 🎉 Success!

Your frontend codebase is now complete and ready for development. You can start the development server and begin building features!

For questions or issues, refer to the troubleshooting section or check the project documentation.

