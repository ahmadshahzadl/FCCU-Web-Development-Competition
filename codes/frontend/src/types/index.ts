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
export type UserRole = 'admin' | 'student' | 'team' | 'manager';

/**
 * User data structure returned from the API
 * Matches backend API response format
 */
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  role: UserRole;
  studentId?: string;
}

/**
 * Sign-in request payload
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Sign-in response data structure
 * Matches backend API response format
 */
export interface SignInResponseData {
  user: User;
  token: string;
}

/**
 * API Success Response wrapper
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * API Error Response wrapper
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: any;
  stack?: string; // Only in development
}

/**
 * Sign-in API response
 */
export interface SignInResponse extends ApiSuccessResponse<SignInResponseData> {}

/**
 * Generic API Response type
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Legacy types for backward compatibility
export interface LoginCredentials extends SignInRequest {}
export interface LoginResponse extends SignInResponseData {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

