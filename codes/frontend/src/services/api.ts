import axios, { AxiosInstance, AxiosError } from 'axios';
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
  LoginCredentials,
  LoginResponse,
  User,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>('/auth/me');
    return response.data;
  }

  // Request Management
  async getRequests(params?: {
    status?: string;
    category?: string;
    studentId?: string;
    page?: number;
    limit?: number;
  }): Promise<ServiceRequest[]> {
    const response = await this.api.get<ServiceRequest[]>('/requests', { params });
    return response.data;
  }

  async getRequestById(id: string): Promise<ServiceRequest> {
    const response = await this.api.get<ServiceRequest>(`/requests/${id}`);
    return response.data;
  }

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

    const response = await this.api.post<ServiceRequest>('/requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateRequest(id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const response = await this.api.put<ServiceRequest>(`/requests/${id}`, data);
    return response.data;
  }

  async updateRequestStatus(
    id: string,
    status: ServiceRequest['status'],
    adminNotes?: string
  ): Promise<ServiceRequest> {
    const response = await this.api.put<ServiceRequest>(`/requests/${id}/status`, {
      status,
      adminNotes,
    });
    return response.data;
  }

  async deleteRequest(id: string): Promise<void> {
    await this.api.delete(`/requests/${id}`);
  }

  async getUserRequests(userId: string): Promise<ServiceRequest[]> {
    const response = await this.api.get<ServiceRequest[]>(`/requests/user/${userId}`);
    return response.data;
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const response = await this.api.get<Announcement[]>('/announcements');
    return response.data;
  }

  async getAnnouncementById(id: string): Promise<Announcement> {
    const response = await this.api.get<Announcement>(`/announcements/${id}`);
    return response.data;
  }

  // Chat
  async getChatMessages(requestId: string): Promise<Chat> {
    const response = await this.api.get<Chat>(`/chat/${requestId}`);
    return response.data;
  }

  async sendMessage(requestId: string, message: string): Promise<ChatMessage> {
    const response = await this.api.post<ChatMessage>(`/chat/${requestId}/message`, {
      message,
    });
    return response.data;
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    const response = await this.api.get<Chat[]>(`/chat/user/${userId}`);
    return response.data;
  }

  // Analytics
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const response = await this.api.get<AnalyticsOverview>('/analytics/overview');
    return response.data;
  }

  async getCategoryStats(): Promise<CategoryStats[]> {
    const response = await this.api.get<CategoryStats[]>('/analytics/category');
    return response.data;
  }

  async getTrends(startDate?: string, endDate?: string): Promise<TrendData[]> {
    const response = await this.api.get<TrendData[]>('/analytics/trends', {
      params: { startDate, endDate },
    });
    return response.data;
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const response = await this.api.get<Notification[]>('/notifications');
    return response.data;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.api.put(`/notifications/${id}/read`);
  }

  async deleteNotification(id: string): Promise<void> {
    await this.api.delete(`/notifications/${id}`);
  }
}

export const apiService = new ApiService();

