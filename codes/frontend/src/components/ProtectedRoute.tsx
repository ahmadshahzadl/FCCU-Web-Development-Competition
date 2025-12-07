import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
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
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

