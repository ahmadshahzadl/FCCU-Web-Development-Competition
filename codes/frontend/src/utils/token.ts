/**
 * Token Utility
 * 
 * Provides utilities for JWT token validation and parsing
 * Note: This is client-side validation only. Backend always validates tokens.
 */

/**
 * Decode JWT token payload (without verification)
 * 
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Check if a JWT token is expired
 * 
 * @param token - JWT token string
 * @returns True if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true; // Consider invalid tokens as expired
    }

    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();

    // Add 5 minute buffer to account for clock skew
    return currentTime >= expirationTime - 5 * 60 * 1000;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Consider errors as expired
  }
}

/**
 * Get token expiration time
 * 
 * @param token - JWT token string
 * @returns Expiration date or null if invalid
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
}

/**
 * Check if token is valid (not expired)
 * 
 * @param token - JWT token string
 * @returns True if token is valid, false otherwise
 */
export function isTokenValid(token: string): boolean {
  if (!token) return false;
  return !isTokenExpired(token);
}

