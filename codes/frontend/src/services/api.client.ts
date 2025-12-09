/**
 * API Client
 * 
 * Centralized HTTP client using Axios with interceptors
 * Handles authentication, error handling, and request/response transformation
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { ApiSuccessResponse, ApiErrorResponse } from '@/types';

/**
 * Configuration for API requests
 */
interface RequestOptions extends AxiosRequestConfig {
  /**
   * Whether the request requires authentication
   * Default: true
   */
  requiresAuth?: boolean;
}

/**
 * API Client Class
 * Provides a centralized way to make HTTP requests with automatic token injection
 */
class ApiClient {
  private api: AxiosInstance;
  private readonly baseURL: string;

  constructor() {
    // Get base URL from environment variable or use default
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Create Axios instance
    this.api = axios.create({
      baseURL: `${this.baseURL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - Add auth token to requests
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage
        const token = this.getToken();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor - Handle errors and transform responses
    this.api.interceptors.response.use(
      (response) => {
        // Return the response as-is, transformation happens in service methods
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Get authentication token from localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): Error {
    // Handle network errors
    if (!error.response) {
      return new Error(
        error.message || 'Network error. Please check your connection.'
      );
    }

    const status = error.response.status;
    const responseData = error.response.data as ApiErrorResponse | any;

    // Handle 401 Unauthorized - Clear auth and redirect to login
    if (status === 401) {
      this.handleUnauthorized();
      return new Error(
        responseData?.message || 'Unauthorized. Please sign in again.'
      );
    }

    // Handle 403 Forbidden
    if (status === 403) {
      return new Error(
        responseData?.message || 'You do not have permission to perform this action.'
      );
    }

    // Handle 404 Not Found
    if (status === 404) {
      return new Error(
        responseData?.message || 'The requested resource was not found.'
      );
    }

    // Handle 429 Too Many Requests (Rate Limiting)
    if (status === 429) {
      const retryAfter = error.response?.headers?.['retry-after'] || 
                        error.response?.headers?.['Retry-After'] ||
                        responseData?.retryAfter;
      const retryMessage = retryAfter 
        ? `Too many requests. Please try again after ${retryAfter} seconds.`
        : 'Too many requests. Please wait a moment before trying again.';
      return new Error(retryMessage);
    }

    // Handle 400 Bad Request
    if (status === 400) {
      // Check if it's a route configuration issue (Invalid _id: me)
      const message = responseData?.message || '';
      if (message.includes('Invalid _id') || message.includes('Invalid id')) {
        return new Error(
          `Backend route configuration issue: ${message}. The /api/users/me route must be defined before /api/users/:id route.`
        );
      }
      return new Error(
        responseData?.message || 'Invalid request. Please check your input.'
      );
    }

    // Handle 409 Conflict (e.g., duplicate category name)
    if (status === 409) {
      const message = responseData?.message || 'A resource with this information already exists.';
      const conflictError = new Error(message);
      (conflictError as any).status = 409;
      return conflictError;
    }

    // Handle 500 Internal Server Error
    if (status >= 500) {
      return new Error(
        responseData?.message || 'Server error. Please try again later.'
      );
    }

    // Handle other errors
    return new Error(
      responseData?.message || error.message || 'An unexpected error occurred.'
    );
  }

  /**
   * Handle unauthorized access (401)
   * Clears authentication data and redirects to login
   * Note: Uses a delayed redirect to allow React Router to handle navigation first
   */
  private handleUnauthorized(): void {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');

    // Only redirect if we're not already on the login page
    // Use a delay to allow React Router ProtectedRoute to handle the redirect first
    // This prevents double redirects and allows components to handle errors gracefully
    if (window.location.pathname !== '/login') {
      // Use setTimeout to allow React Router to handle navigation first
      // ProtectedRoute will detect isAuthenticated is false and redirect
      setTimeout(() => {
        // Only redirect if still not on login page (React Router didn't handle it)
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }, 200);
    }
  }

  /**
   * Make a generic HTTP request
   * 
   * @param endpoint - API endpoint (e.g., '/auth/signin')
   * @param options - Request options including method, data, headers, etc.
   * @returns Promise resolving to API response
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiSuccessResponse<T>> {
    const { requiresAuth = true, ...axiosConfig } = options;

    try {
      const response = await this.api.request<ApiSuccessResponse<T>>({
        url: endpoint,
        ...axiosConfig,
      });

      // Extract the actual API response from axios response.data
      // The backend returns { success: true, data: T, message?: string }
      return response.data as ApiSuccessResponse<T>;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make a GET request
   * 
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise resolving to API response
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiSuccessResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Make a POST request
   * 
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to API response
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiSuccessResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      data,
    });
  }

  /**
   * Make a PUT request
   * 
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to API response
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiSuccessResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      data,
    });
  }

  /**
   * Make a PATCH request
   * 
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to API response
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiSuccessResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      data,
    });
  }

  /**
   * Make a DELETE request
   * 
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise resolving to API response
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiSuccessResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

