/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls
 * Separated from main API service for better organization
 */

import { apiClient } from './api.client';
import type { SignInRequest, SignInResponse, SignInResponseData, User } from '@/types';

/**
 * Authentication Service Class
 * Provides methods for user authentication operations
 */
class AuthService {
  /**
   * Sign in a user with email and password
   * 
   * @param credentials - User email and password
   * @returns Promise resolving to sign-in response with user data and token
   * @throws Error if sign-in fails
   */
  async signIn(credentials: SignInRequest): Promise<SignInResponse> {
    try {
      const response = await apiClient.post<SignInResponseData>(
        '/auth/signin',
        credentials,
        { requiresAuth: false }
      );

      // Validate response structure
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Sign in failed');
      }

      // Return response as SignInResponse (which is ApiSuccessResponse<SignInResponseData>)
      return response as SignInResponse;
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Sign in failed. Please check your credentials.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get current authenticated user
   * 
   * @returns Promise resolving to current user data
   * @throws Error if user is not authenticated or request fails
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch user data');
      }

      return response.data.user;
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch user data';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Sign out the current user
   * Note: This clears local storage. Backend logout endpoint can be added if needed.
   */
  signOut(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  }
}

export const authService = new AuthService();

