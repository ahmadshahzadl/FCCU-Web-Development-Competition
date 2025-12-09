/**
 * API Service
 * 
 * Provides methods for all API endpoints except authentication
 * Uses the centralized API client for consistency
 */

import { apiClient } from './api.client';
import type {
  ServiceRequest,
  CreateRequestDto,
  UpdateRequestStatusData,
  RequestCountResponse,
  PaginatedResponse,
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  Announcement,
  CreateAnnouncementData,
  Chat,
  ChatMessage,
  AnalyticsOverview,
  CategoryStats,
  TrendData,
  Notification,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateProfileRequest,
  UserStats,
  SystemConfig,
  UpdateProjectNameRequest,
  UpdateLogoRequest,
  AddEmailDomainRequest,
  RemoveEmailDomainRequest,
  PublicSystemConfig,
  RequestStatistics,
  CategoryChartData,
  StatusChartData,
  DailyChartData,
  AnalyticsSummary,
  AIChatRequest,
  AIChatResponse,
  SystemPromptResponse,
  UpdateSystemPromptRequest,
  UpdateSystemPromptResponse,
  CampusMapMarker,
  CreateMarkerRequest,
  UpdateMarkerRequest,
  MarkersResponse,
  MarkerResponse,
  MarkerStatistics,
  StatisticsResponse,
} from '@/types';

/**
 * API Service Class
 * Handles all non-authentication API calls
 */
class ApiService {

  // ==================== Category Management ====================

  /**
   * Get all categories
   */
  async getCategories(includeInactive: boolean = false): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories', {
      params: includeInactive ? { includeInactive: 'true' } : {},
    });
    // Handle both direct array and wrapped response
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    // Check if it's a wrapped response with nested data
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    return [];
  }

  /**
   * Get a single category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  }

  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  }

  /**
   * Update a category
   */
  async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    const response = await apiClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete<void>(`/categories/${id}`);
  }

  /**
   * Activate a category
   */
  async activateCategory(id: string): Promise<Category> {
    const response = await apiClient.put<Category>(`/categories/${id}/activate`);
    return response.data;
  }

  /**
   * Deactivate a category
   */
  async deactivateCategory(id: string): Promise<Category> {
    const response = await apiClient.put<Category>(`/categories/${id}/deactivate`);
    return response.data;
  }

  // ==================== Request Management ====================

  /**
   * Get all service requests with optional filters and pagination
   */
  async getRequests(params?: {
    status?: string;
    category?: string;
    studentId?: string;
    page?: number;
    limit?: number;
  }): Promise<ServiceRequest[] | PaginatedResponse<ServiceRequest>> {
    const response = await apiClient.get<ServiceRequest[] | PaginatedResponse<ServiceRequest>>('/requests', {
      params,
    });
    return response.data;
  }

  /**
   * Get request count with optional filters
   */
  async getRequestCount(params?: {
    status?: string;
    category?: string;
    studentId?: string;
  }): Promise<RequestCountResponse> {
    const response = await apiClient.get<RequestCountResponse>('/requests/count', {
      params,
    });
    return response.data;
  }

  /**
   * Get a single service request by ID
   */
  async getRequestById(id: string): Promise<ServiceRequest> {
    const response = await apiClient.get<ServiceRequest>(`/requests/${id}`);
    return response.data;
  }

  /**
   * Create a new service request
   */
  async createRequest(data: CreateRequestDto): Promise<ServiceRequest> {
    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('description', data.description);
    if (data.studentName) {
      formData.append('studentName', data.studentName);
    }
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }

    const response = await apiClient.post<ServiceRequest>('/requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Update a service request
   */
  async updateRequest(id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const response = await apiClient.put<ServiceRequest>(`/requests/${id}`, data);
    return response.data;
  }

  /**
   * Update request status
   */
  async updateRequestStatus(
    id: string,
    data: UpdateRequestStatusData
  ): Promise<ServiceRequest> {
    const response = await apiClient.put<ServiceRequest>(`/requests/${id}/status`, data);
    return response.data;
  }

  /**
   * Delete a service request
   */
  async deleteRequest(id: string): Promise<void> {
    await apiClient.delete<void>(`/requests/${id}`);
  }

  /**
   * Get all requests for a specific user
   */
  async getUserRequests(userId: string): Promise<ServiceRequest[]> {
    const response = await apiClient.get<ServiceRequest[]>(`/requests/user/${userId}`);
    return response.data;
  }

  // ==================== Announcements ====================

  // Get user's announcements
  async getUserAnnouncements(): Promise<Announcement[]> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.get<Announcement[]>('/announcements/me');
    return response.data;
  }

  // Get unread announcements
  async getUnreadAnnouncements(): Promise<Announcement[]> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.get<Announcement[]>('/announcements/me/unread');
    return response.data;
  }

  // Get unread count
  async getUnreadCount(): Promise<number> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.get<{ count: number }>('/announcements/me/unread-count');
    return response.data.count;
  }

  // Mark announcement as read
  async markAnnouncementAsRead(id: string): Promise<Announcement> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.put<Announcement>(`/announcements/${id}/read`);
    return response.data;
  }

  // Mark all announcements as read
  async markAllAnnouncementsAsRead(): Promise<void> {
    await apiClient.put<void>('/announcements/me/read-all');
  }

  // Create announcement (admin/manager only)
  async createAnnouncement(data: CreateAnnouncementData): Promise<Announcement> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.post<Announcement>('/announcements', data);
    return response.data;
  }

  // Get all announcements (admin/manager only)
  async getAllAnnouncements(): Promise<Announcement[]> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.get<Announcement[]>('/announcements');
    return response.data;
  }

  // Delete announcement (admin/manager only)
  async deleteAnnouncement(id: string): Promise<void> {
    await apiClient.delete<void>(`/announcements/${id}`);
  }

  // Get announcement by ID
  async getAnnouncementById(id: string): Promise<Announcement> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.get<Announcement>(`/announcements/${id}`);
    return response.data;
  }

  // Legacy method for backward compatibility
  async getAnnouncements(): Promise<Announcement[]> {
    return this.getUserAnnouncements();
  }

  // ==================== Chat ====================

  /**
   * Get chat messages for a request
   */
  async getChatMessages(requestId: string): Promise<Chat> {
    const response = await apiClient.get<Chat>(`/chat/${requestId}`);
    return response.data;
  }

  /**
   * Send a message in a chat
   */
  async sendMessage(requestId: string, message: string): Promise<ChatMessage> {
    const response = await apiClient.post<ChatMessage>(`/chat/${requestId}/message`, {
      message,
    });
    return response.data;
  }

  /**
   * Get all chats for a user
   */
  async getUserChats(userId: string): Promise<Chat[]> {
    const response = await apiClient.get<Chat[]>(`/chat/user/${userId}`);
    return response.data;
  }

  // ==================== Analytics ====================

  /**
   * Get analytics overview
   */
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const response = await apiClient.get<AnalyticsOverview>('/analytics/overview');
    return response.data;
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<CategoryStats[]> {
    const response = await apiClient.get<CategoryStats[]>('/analytics/category');
    return response.data;
  }

  /**
   * Get trend data
   */
  async getTrends(startDate?: string, endDate?: string): Promise<TrendData[]> {
    const response = await apiClient.get<TrendData[]>('/analytics/trends', {
      params: { startDate, endDate },
    });
    return response.data;
  }

  // ==================== Notifications ====================

  /**
   * Get all notifications
   */
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  }

  /**
   * Mark a notification as read
   */
  async markNotificationAsRead(id: string): Promise<void> {
    await apiClient.put<void>(`/notifications/${id}/read`);
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<void> {
    await apiClient.delete<void>(`/notifications/${id}`);
  }

  // ==================== User Management (Admin Only) ====================

  /**
   * Get all users with optional filters
   */
  async getUsers(params?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users', {
      params,
    });
    // Handle both direct array and wrapped response
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    // Check if it's a wrapped response with nested data
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    return [];
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<UserStats>('/users/stats');
    return response.data;
  }

  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  }

  /**
   * Update a user
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete<void>(`/users/${id}`);
  }

  /**
   * Update user role
   */
  async updateUserRole(id: string, role: string): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}/role`, { role });
    return response.data;
  }

  // ==================== User Profile (All Roles) ====================

  /**
   * Transform backend user data (_id) to frontend format (id)
   */
  private transformUser(user: any): User {
    if (!user) return user;
    // Handle both _id (backend) and id (frontend) formats
    const id = user.id || user._id || user.id;
    return {
      ...user,
      id,
    };
  }

  /**
   * Get current user profile
   * Accessible by all authenticated users
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<any>('/users/me');
    return this.transformUser(response.data);
  }

  /**
   * Update current user profile
   * Students/Team/Manager can only update name and password
   * Admins can update name, password, email, and username
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<any>('/users/me', data);
    return this.transformUser(response.data);
  }

  // System Configuration Methods (Admin Only)
  async getSystemConfig(): Promise<SystemConfig> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.get<SystemConfig>('/system-config');
    return response.data;
  }

  async updateProjectName(data: UpdateProjectNameRequest): Promise<SystemConfig> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.put<SystemConfig>(
      '/system-config/name',
      data
    );
    return response.data;
  }

  async updateLogo(data: UpdateLogoRequest): Promise<SystemConfig> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.put<SystemConfig>(
      '/system-config/logo',
      data
    );
    return response.data;
  }

  async addEmailDomain(data: AddEmailDomainRequest): Promise<SystemConfig> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.post<SystemConfig>(
      '/system-config/email-domains',
      data
    );
    return response.data;
  }

  async removeEmailDomain(data: RemoveEmailDomainRequest): Promise<SystemConfig> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.delete<SystemConfig>(
      '/system-config/email-domains',
      { data }
    );
    return response.data;
  }

  // Public System Configuration (No authentication required)
  async getPublicSystemConfig(): Promise<PublicSystemConfig> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.get<PublicSystemConfig>(
      '/system-config/public',
      { requiresAuth: false }
    );
    const result = response.data;
    // Ensure projectName is always present
    return {
      projectName: result.projectName || 'Campus Helper',
      logoUrl: result.logoUrl,
    };
  }

  // ==================== Analytics ====================

  /**
   * Get request statistics
   */
  async getRequestStatistics(): Promise<RequestStatistics> {
    const response = await apiClient.get<RequestStatistics>('/analytics/statistics');
    return response.data;
  }

  /**
   * Get current month category chart
   */
  async getCurrentMonthCategoryChart(): Promise<CategoryChartData> {
    const response = await apiClient.get<CategoryChartData>('/analytics/charts/category');
    return response.data;
  }

  /**
   * Get current month status chart
   */
  async getCurrentMonthStatusChart(): Promise<StatusChartData> {
    const response = await apiClient.get<StatusChartData>('/analytics/charts/status');
    return response.data;
  }

  /**
   * Get current month daily chart
   */
  async getCurrentMonthDailyChart(): Promise<DailyChartData> {
    const response = await apiClient.get<DailyChartData>('/analytics/charts/daily');
    return response.data;
  }

  /**
   * Get complete analytics summary
   */
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.get<AnalyticsSummary>('/analytics/summary');
    return response.data;
  }

  // ==================== AI Chatbot ====================

  /**
   * Send a chat message to AI assistant
   */
  async sendAIChatMessage(
    message: string,
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<AIChatResponse> {
    const requestData: AIChatRequest = {
      message,
      conversationHistory,
    };
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.post<{ response: string }>('/ai/chat', requestData);
    // Response is already ApiSuccessResponse<{ response: string }> which matches AIChatResponse
    return response;
  }

  /**
   * Get system prompt (admin only)
   */
  async getSystemPrompt(): Promise<SystemPromptResponse> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.get<{ systemPrompt: string }>('/ai/system-prompt');
    // Response is already ApiSuccessResponse<{ systemPrompt: string }> which matches SystemPromptResponse
    return response;
  }

  /**
   * Update system prompt (admin only)
   */
  async updateSystemPrompt(systemPrompt: string): Promise<UpdateSystemPromptResponse> {
    const requestData: UpdateSystemPromptRequest = {
      systemPrompt,
    };
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.put<{ systemPrompt: string; updatedAt: string }>('/ai/system-prompt', requestData);
    // Ensure message is always a string to match UpdateSystemPromptResponse
    return {
      ...response,
      message: response.message || 'System prompt updated successfully',
    };
  }

  // ==================== Campus Map ====================

  /**
   * Get all active markers (all authenticated users)
   */
  async getAllMarkers(category?: string): Promise<MarkersResponse> {
    // Backend returns { success: true, data: CampusMapMarker[], count: number }
    // API client returns ApiSuccessResponse<T> which extracts response.data from axios
    // So we get { success: true, data: { success: true, data: [...], count: number } }
    // Actually, the API client returns response.data which is the axios response.data
    // So if backend returns { success: true, data: [...], count: 1 }, 
    // axios response.data is { success: true, data: [...], count: 1 }
    // and API client returns that as ApiSuccessResponse
    const response = await apiClient.get<any>(
      '/campus-map',
      category ? { params: { category } } : undefined
    );
    // Handle both standard ApiSuccessResponse and backend response with count
    const backendData = response.data;
    const data = Array.isArray(backendData?.data) ? backendData.data : (Array.isArray(backendData) ? backendData : []);
    const count = backendData?.count ?? data.length;
    return {
      success: true,
      data,
      count,
    };
  }

  /**
   * Get markers by category (all authenticated users)
   */
  async getMarkersByCategory(category: string): Promise<MarkersResponse> {
    const response = await apiClient.get<any>(`/campus-map/category/${category}`);
    const backendData = response.data;
    const data = Array.isArray(backendData?.data) ? backendData.data : (Array.isArray(backendData) ? backendData : []);
    const count = backendData?.count ?? data.length;
    return {
      success: true,
      data,
      count,
    };
  }

  /**
   * Get marker by ID (all authenticated users)
   */
  async getMarkerById(id: string): Promise<MarkerResponse> {
    const response = await apiClient.get<CampusMapMarker>(`/campus-map/${id}`);
    return {
      success: true,
      data: response.data,
    };
  }

  /**
   * Get all markers including inactive (admin only)
   */
  async getAllMarkersAdmin(category?: string): Promise<MarkersResponse> {
    const response = await apiClient.get<any>(
      '/campus-map/admin/all',
      category ? { params: { category } } : undefined
    );
    const backendData = response.data;
    const data = Array.isArray(backendData?.data) ? backendData.data : (Array.isArray(backendData) ? backendData : []);
    const count = backendData?.count ?? data.length;
    return {
      success: true,
      data,
      count,
    };
  }

  /**
   * Create marker (admin only)
   */
  async createMarker(data: CreateMarkerRequest): Promise<MarkerResponse> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.post<CampusMapMarker>('/campus-map', data);
    return {
      success: true,
      data: response.data,
    };
  }

  /**
   * Update marker (admin only)
   */
  async updateMarker(id: string, data: UpdateMarkerRequest): Promise<MarkerResponse> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.put<CampusMapMarker>(`/campus-map/${id}`, data);
    return {
      success: true,
      data: response.data,
    };
  }

  /**
   * Delete marker (admin only)
   */
  async deleteMarker(id: string): Promise<{ success: true; message: string }> {
    await apiClient.delete<void>(`/campus-map/${id}`);
    return {
      success: true,
      message: 'Marker deleted successfully',
    };
  }

  /**
   * Get statistics (admin only)
   */
  async getMarkerStatistics(): Promise<StatisticsResponse> {
    // API client returns ApiSuccessResponse<T>, so we pass the inner data type
    const response = await apiClient.get<MarkerStatistics>('/campus-map/admin/statistics');
    return {
      success: true,
      data: response.data,
    };
  }
}

export const apiService = new ApiService();

