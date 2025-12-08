import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Home from './pages/Home';
import ServiceRequest from './pages/ServiceRequest';
import Dashboard from './pages/Dashboard';
import Map from './pages/Map';
import Announcements from './pages/Announcements';
import RequestHistory from './pages/RequestHistory';
import Analytics from './pages/Analytics';
import Chat from './pages/Chat';
import UserManagement from './pages/UserManagement';
import RequestManagement from './pages/RequestManagement';
import CategoryManagement from './pages/CategoryManagement';
import TeamRequestsList from './pages/TeamRequestsList';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot/Chatbot';
import { useStudentSocket } from './hooks/useStudentSocket';

const ToasterWithTheme = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerClassName="!top-4 !right-4"
      containerStyle={{
        zIndex: 9999,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#f9fafb' : '#111827',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: isDark
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.05)',
          maxWidth: '420px',
          minWidth: '300px',
          fontSize: '14px',
          lineHeight: '1.5',
          fontWeight: '500',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
        className: 'toast-custom',
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
          style: {
            background: isDark ? 'rgba(6, 78, 59, 0.9)' : 'rgba(236, 253, 245, 0.95)',
            color: isDark ? '#d1fae5' : '#065f46',
            borderLeft: '4px solid #10b981',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
          style: {
            background: isDark ? 'rgba(127, 29, 29, 0.9)' : 'rgba(254, 242, 242, 0.95)',
            color: isDark ? '#fecaca' : '#991b1b',
            borderLeft: '4px solid #ef4444',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          },
        },
        loading: {
          iconTheme: {
            primary: isDark ? '#3b82f6' : '#2563eb',
            secondary: '#ffffff',
          },
          style: {
            background: isDark ? 'rgba(30, 58, 138, 0.9)' : 'rgba(239, 246, 255, 0.95)',
            color: isDark ? '#bfdbfe' : '#1e40af',
            borderLeft: '4px solid #3b82f6',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          },
        },
      }}
    />
  );
};

const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();

  // Initialize global student socket hook for request update toasts on all pages
  // Hook handles role check internally
  useStudentSocket();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes - Student Access */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'team', 'manager']}>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/request"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout>
              <ServiceRequest />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'team', 'manager']}>
            <Layout>
              <Map />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'team', 'manager']}>
            <Layout>
              <Announcements />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'team', 'manager']}>
            <Layout>
              <RequestHistory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:requestId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout>
              <Chat />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Admin/Manager/Team Access */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'manager', 'team']}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-requests"
        element={
          <ProtectedRoute allowedRoles={['team']}>
            <Layout>
              <TeamRequestsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Profile (All Roles) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'team', 'manager']}>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Admin and Manager */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Layout>
              <UserManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Layout>
              <RequestManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Layout>
              <CategoryManagement />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home or login */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Chatbot />
          <ToasterWithTheme />
    </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

