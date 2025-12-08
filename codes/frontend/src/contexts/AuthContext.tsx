/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application
 * Uses the auth service for API calls and storage utility for persistence
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { storage } from '@/utils/storage';
import { isTokenValid } from '@/utils/token';
import type { User, SignInRequest, UserRole } from '@/types';

/**
 * Authentication Context Type
 */
interface AuthContextType {
  /** Current authenticated user */
  user: User | null;
  /** Loading state for authentication operations */
  loading: boolean;
  /** Sign in function */
  signIn: (credentials: SignInRequest) => Promise<void>;
  /** Sign out function */
  signOut: () => void;
  /** Check if user is authenticated */
  isAuthenticated: boolean;
  /** Check if user has one of the specified roles */
  hasRole: (roles: UserRole[]) => boolean;
  /** Refresh user data from API */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to access authentication context
 * 
 * @throws Error if used outside AuthProvider
 */
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

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth methods to children
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load authentication state from storage on mount
   */
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = storage.getToken();
        const storedUser = storage.getUser<User>();

        // Validate token if present
        if (token && storedUser) {
          // Check if token is still valid
          if (isTokenValid(token)) {
            setUser(storedUser);
            // Optionally refresh user data from API
            // await refreshUser();
          } else {
            // Token expired, clear storage
            storage.clearAuth();
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        storage.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  /**
   * Sign in user with email and password
   * 
   * @param credentials - User email and password
   * @throws Error if sign-in fails
   */
  const signIn = useCallback(async (credentials: SignInRequest): Promise<void> => {
    try {
      setLoading(true);

      // Call auth service to sign in
      const response = await authService.signIn(credentials);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Sign in failed');
      }

      const { user: userData, token } = response.data;

      // Store authentication data
      storage.setToken(token);
      storage.setUser(userData);
      storage.setUserId(userData.id);

      // Update state
      setUser(userData);

      // Show success message
      const userName = userData.name || userData.username || userData.email;
      toast.success(`Welcome back, ${userName}!`);
    } catch (error: any) {
      // Error message is already formatted by authService
      const errorMessage = error.message || 'Sign in failed. Please check your credentials.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign out current user
   */
  const signOut = useCallback(() => {
    try {
      // Clear storage
      storage.clearAuth();

      // Clear state
      setUser(null);

      // Show success message
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Still clear state even if storage clear fails
      setUser(null);
    }
  }, []);

  /**
   * Refresh user data from API
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const userData = await authService.getCurrentUser();
      storage.setUser(userData);
      storage.setUserId(userData.id);
      setUser(userData);
    } catch (error: any) {
      console.error('Error refreshing user:', error);
      // If refresh fails, sign out user
      signOut();
      throw error;
    }
  }, [signOut]);

  /**
   * Check if user has one of the specified roles
   * 
   * @param roles - Array of roles to check
   * @returns True if user has one of the roles, false otherwise
   */
  const hasRole = useCallback((roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    hasRole,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

