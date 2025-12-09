// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Request Types
export type RequestCategory = 'maintenance' | 'academic' | 'lost-found' | 'general'; // Legacy type for backward compatibility
export type RequestStatus = 'pending' | 'in-progress' | 'resolved';
export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ServiceRequest {
  _id: string;
  category: string; // Category slug (dynamic)
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

export interface UpdateRequestStatusData {
  status: RequestStatus;
  adminNotes?: string;
}

export interface GetRequestsQuery {
  status?: RequestStatus;
  category?: string; // Category slug
  studentId?: string;
  page?: number;
  limit?: number;
}

export interface RequestCountResponse {
  total: number;
}

export interface CreateRequestDto {
  category: RequestCategory;
  description: string;
  studentName?: string;
  attachment?: File;
}

// Announcement Types
export type AnnouncementType = 'notice' | 'event' | 'cancellation' | 'request-update';
export type AnnouncementPriority = 'high' | 'medium' | 'low';
export type AnnouncementTarget = 'all' | 'roles' | 'users';

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  target: AnnouncementTarget;
  targetRoles?: UserRole[];
  targetUserIds?: string[];
  createdBy: string;
  createdByRole: UserRole;
  relatedRequestId?: string;
  readBy?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  type?: AnnouncementType;
  priority?: AnnouncementPriority;
  target: AnnouncementTarget;
  targetRoles?: UserRole[];
  targetUserIds?: string[];
}

export interface AnnouncementCreatedPayload {
  announcement: Announcement;
}

export interface AnnouncementDeletedPayload {
  announcementId: string;
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

// New Analytics Types
export interface RequestStatistics {
  status: {
    pending: number;
    inProgress: number;
    resolved: number;
    total: number;
  };
  category: Record<string, number>; // category slug -> count
  timeRange: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  categoryBreakdown: Array<{
    category: string;
    categoryName: string;
    count: number;
  }>;
}

export interface CategoryChartData {
  month: string;
  data: Array<{
    category: string;
    categoryName: string;
    count: number;
  }>;
  total: number;
}

export interface StatusChartData {
  month: string;
  data: Array<{
    status: 'pending' | 'in-progress' | 'resolved';
    count: number;
  }>;
  total: number;
}

export interface DailyChartData {
  month: string;
  data: Array<{
    date: string; // YYYY-MM-DD format
    count: number;
  }>;
  total: number;
}

export interface AnalyticsSummary {
  statistics: RequestStatistics;
  charts: {
    categoryChart: CategoryChartData;
    statusChart: StatusChartData;
    dailyChart: DailyChartData;
  };
}

// AI Chatbot Types
export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface AIChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface AIChatResponse {
  success: true;
  data: {
    response: string;
  };
}

export interface SystemPromptResponse {
  success: true;
  data: {
    systemPrompt: string;
  };
}

export interface UpdateSystemPromptRequest {
  systemPrompt: string;
}

export interface UpdateSystemPromptResponse {
  success: true;
  data: {
    systemPrompt: string;
    updatedAt: string;
  };
  message: string;
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
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create user request payload
 */
export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  name?: string;
  role: UserRole;
  studentId?: string;
}

/**
 * Update user request payload
 */
export interface UpdateUserRequest {
  email?: string;
  username?: string;
  name?: string;
  role?: UserRole;
  studentId?: string;
}

/**
 * Update profile request payload (for Student/Team/Manager own profile)
 * Email and username can only be updated by admin role
 */
// System Configuration Types
export interface SystemConfig {
  _id: string;
  projectName: string;
  logoUrl?: string;
  allowedEmailDomains: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProjectNameRequest {
  projectName: string;
}

export interface UpdateLogoRequest {
  logo: string;
}

export interface AddEmailDomainRequest {
  domain: string;
}

export interface RemoveEmailDomainRequest {
  domain: string;
}

// Public System Configuration (read-only, no auth required)
export interface PublicSystemConfig {
  projectName: string;
  logoUrl?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  password?: string;
  email?: string; // Only for admin
  username?: string; // Only for admin
}

/**
 * User statistics for admin dashboard
 */
export interface UserStats {
  total: number;
  byRole: {
    admin: number;
    manager: number;
    team: number;
    student: number;
  };
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

// Campus Map Types
export interface CampusMapMarker {
  _id: string;
  name: string;
  category: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  contactInfo?: string;
  openingHours?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarkerRequest {
  name: string;
  category: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  contactInfo?: string;
  openingHours?: string;
  icon?: string;
  isActive?: boolean;
}

export interface UpdateMarkerRequest {
  name?: string;
  category?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  contactInfo?: string;
  openingHours?: string;
  icon?: string;
  isActive?: boolean;
}

export interface MarkersResponse {
  success: true;
  data: CampusMapMarker[];
  count: number;
}

export interface MarkerResponse {
  success: true;
  data: CampusMapMarker;
}

export interface MarkerStatistics {
  total: number;
  active: number;
  inactive: number;
  byCategory: Record<string, number>;
  uniqueCategories: string[];
}

export interface StatisticsResponse {
  success: true;
  data: MarkerStatistics;
}

