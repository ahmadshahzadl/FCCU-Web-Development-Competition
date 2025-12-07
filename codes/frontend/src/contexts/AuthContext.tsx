import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { User, LoginCredentials, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // Demo credentials - for development/testing
      const demoUsers: Record<string, { user: User; token: string }> = {
        'student@campus.edu': {
          user: {
            _id: 'student-001',
            name: 'John Student',
            email: 'student@campus.edu',
            role: 'student',
            studentId: 'STU-2024-001',
          },
          token: 'demo-token-student',
        },
        'admin@campus.edu': {
          user: {
            _id: 'admin-001',
            name: 'Admin User',
            email: 'admin@campus.edu',
            role: 'admin',
          },
          token: 'demo-token-admin',
        },
        'team@campus.edu': {
          user: {
            _id: 'team-001',
            name: 'Team Member',
            email: 'team@campus.edu',
            role: 'team',
          },
          token: 'demo-token-team',
        },
        'manager@campus.edu': {
          user: {
            _id: 'manager-001',
            name: 'Manager User',
            email: 'manager@campus.edu',
            role: 'manager',
          },
          token: 'demo-token-manager',
        },
      };

      // Check demo credentials
      const demoUser = demoUsers[credentials.email.toLowerCase()];
      
      if (demoUser && credentials.password === 'password') {
        // Store user and token
        localStorage.setItem('user', JSON.stringify(demoUser.user));
        localStorage.setItem('token', demoUser.token);
        localStorage.setItem('userId', demoUser.user._id);
        
        setUser(demoUser.user);
        toast.success(`Welcome back, ${demoUser.user.name}!`);
        return;
      }

      // If not demo user, try API login
      try {
        const response = await apiService.login(credentials);
        
        // Store user and token
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user._id);
        
        setUser(response.user);
        toast.success(`Welcome back, ${response.user.name}!`);
      } catch (apiError: any) {
        const errorMessage = apiError.response?.data?.message || 'Login failed. Please check your credentials.';
        toast.error(errorMessage);
        throw apiError;
      }
    } catch (error: any) {
      // If it's not an API error, it's a demo login error
      if (!error.response) {
        toast.error('Invalid email or password. Use demo credentials: student@campus.edu / password');
        throw error;
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

