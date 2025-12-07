/**
 * Auth Module Type Definitions
 */

// User-related types
export interface IUser {
  _id: string;
  email: string;
  password: string;
  name?: string;
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
    name?: string;
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
  iat?: number;
  exp?: number;
}

// User public data (without sensitive fields)
export interface PublicUserData {
  id: string;
  email: string;
  name?: string;
}

