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
  Announcement,
  Chat,
  ChatMessage,
  AnalyticsOverview,
  CategoryStats,
  StatusStats,
  TrendData,
  Notification,
} from '@/types';

/**
 * API Service Class
 * Handles all non-authentication API calls
 */
class ApiService {

  // ==================== Request Management ====================

  /**
   * Get all service requests with optional filters
   */
  async getRequests(params?: {
    status?: string;
    category?: string;
    studentId?: string;
    page?: number;
    limit?: number;
  }): Promise<ServiceRequest[]> {
    const response = await apiClient.get<ServiceRequest[]>('/requests', {
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
    status: ServiceRequest['status'],
    adminNotes?: string
  ): Promise<ServiceRequest> {
    const response = await apiClient.put<ServiceRequest>(`/requests/${id}/status`, {
      status,
      adminNotes,
    });
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

  /**
   * Get all announcements
   */
  async getAnnouncements(): Promise<Announcement[]> {
    const response = await apiClient.get<Announcement[]>('/announcements');
    return response.data;
  }

  /**
   * Get a single announcement by ID
   */
  async getAnnouncementById(id: string): Promise<Announcement> {
    const response = await apiClient.get<Announcement>(`/announcements/${id}`);
    return response.data;
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
}

export const apiService = new ApiService();

