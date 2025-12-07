// Request Types
export type RequestCategory = 'maintenance' | 'academic' | 'lost-found' | 'general';
export type RequestStatus = 'pending' | 'in-progress' | 'resolved';
export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ServiceRequest {
  _id: string;
  category: RequestCategory;
  description: string;
  status: RequestStatus;
  studentId?: string;
  studentName?: string;
  attachmentUrl?: string;
  adminNotes?: string;
  priority?: RequestPriority;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface CreateRequestDto {
  category: RequestCategory;
  description: string;
  studentName?: string;
  attachment?: File;
}

// Announcement Types
export type AnnouncementType = 'notice' | 'event' | 'cancellation';
export type AnnouncementPriority = 'high' | 'medium' | 'low';

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  createdAt: string;
}

// Chat Types
export interface ChatMessage {
  _id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface Chat {
  _id: string;
  requestId: string;
  messages: ChatMessage[];
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

// Map Types
export type LocationType = 'academic' | 'hostel' | 'cafeteria' | 'library' | 'other';

export interface CampusLocation {
  _id: string;
  name: string;
  type: LocationType;
  coordinates: [number, number]; // [latitude, longitude]
  description?: string;
}

// Notification Types
export type NotificationType = 'status-update' | 'new-message' | 'request-resolved' | 'announcement';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  requestId?: string;
  read: boolean;
  createdAt: string;
}

// Analytics Types
export interface AnalyticsOverview {
  totalRequests: number;
  activeRequests: number;
  resolvedRequests: number;
  averageResolutionTime: number;
  requestsThisMonth: number;
  requestsThisWeek: number;
}

export interface CategoryStats {
  category: RequestCategory;
  count: number;
  percentage: number;
}

export interface StatusStats {
  status: RequestStatus;
  count: number;
  percentage: number;
}

export interface TrendData {
  date: string;
  count: number;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  studentId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

