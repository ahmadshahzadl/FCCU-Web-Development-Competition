/**
 * Protected Route Component
 * 
 * Protects routes based on authentication status and user roles
 * Redirects unauthenticated users to login and unauthorized users to unauthorized page
 */

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole, loading, user } = useAuth();
  const location = useLocation();

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

  // Redirect to login if not authenticated, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && !hasRole(allowedRoles)) {
    // Log unauthorized access attempt for admin users
    if (user?.role === 'admin') {
      console.warn(`Admin user attempted to access route requiring roles: ${allowedRoles.join(', ')}`);
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

