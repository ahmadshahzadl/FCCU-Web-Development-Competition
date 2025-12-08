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

const ToasterWithTheme = () => {
  const { theme } = useTheme();
  
  return (
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
          background: theme === 'dark' ? '#1f2937' : '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
  );
};

const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();

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

