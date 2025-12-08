/**
 * Storage Utility
 * 
 * Provides type-safe localStorage operations for authentication data
 * Centralizes storage key management and error handling
 */

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  USER_ID: 'userId',
} as const;

/**
 * Storage utility class
 * Provides methods for storing and retrieving authentication data
 */
class Storage {
  /**
   * Get authentication token from localStorage
   * 
   * @returns Token string or null if not found
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error reading token from storage:', error);
      return null;
    }
  }

  /**
   * Set authentication token in localStorage
   * 
   * @param token - JWT token string
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw new Error('Failed to store authentication token');
    }
  }

  /**
   * Get user data from localStorage
   * 
   * @returns User object or null if not found
   */
  getUser<T = any>(): T | null {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userStr) return null;
      return JSON.parse(userStr) as T;
    } catch (error) {
      console.error('Error reading user from storage:', error);
      return null;
    }
  }

  /**
   * Set user data in localStorage
   * 
   * @param user - User object to store
   */
  setUser<T = any>(user: T): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
      throw new Error('Failed to store user data');
    }
  }

  /**
   * Get user ID from localStorage
   * 
   * @returns User ID string or null if not found
   */
  getUserId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_ID);
    } catch (error) {
      console.error('Error reading user ID from storage:', error);
      return null;
    }
  }

  /**
   * Set user ID in localStorage
   * 
   * @param userId - User ID string
   */
  setUserId(userId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    } catch (error) {
      console.error('Error storing user ID:', error);
    }
  }

  /**
   * Clear all authentication data from localStorage
   */
  clearAuth(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Check if user is authenticated (has token and user data)
   * 
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return !!(this.getToken() && this.getUser());
  }
}

// Export singleton instance
export const storage = new Storage();

// Export storage keys for external use if needed
export { STORAGE_KEYS };

