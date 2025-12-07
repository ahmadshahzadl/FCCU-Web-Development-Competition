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
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
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
          <ProtectedRoute allowedRoles={['student', 'admin', 'team', 'manager']}>
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
          <ProtectedRoute allowedRoles={['student', 'admin', 'team', 'manager']}>
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
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Layout>
              <Analytics />
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

