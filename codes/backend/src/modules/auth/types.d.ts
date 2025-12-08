/**
 * Auth Module Type Definitions
 */

// User Role type
export type UserRole = 'admin' | 'manager' | 'team' | 'student';

// User-related types
export interface IUser {
  _id: string;
  email: string;
  username: string;
  password: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Sign In types
export interface SignInInput {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: {
    id: string;
    email: string;
    username: string;
    name?: string;
    role: UserRole;
  };
  token: string;
}

// Request body types
export interface SignInRequestBody {
  email: string;
  password: string;
}

// Response types
export interface AuthSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface AuthErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// JWT Payload type
export interface JWTPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// User public data (without sensitive fields)
export interface PublicUserData {
  id: string;
  email: string;
  username: string;
  name?: string;
  role: UserRole;
}

// Create User Input
export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  name?: string;
  role: UserRole;
}

// Update User Input
export interface UpdateUserInput {
  email?: string;
  username?: string;
  password?: string;
  name?: string;
  role?: UserRole;
}

