import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env';

// Custom Error Classes
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

// Handle MongoDB Cast Error (Invalid ID)
const handleCastErrorDB = (err: mongoose.Error.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle MongoDB Duplicate Key Error
const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 409);
};

// Handle MongoDB Validation Error
const handleValidationErrorDB = (err: mongoose.Error.ValidationError): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle JWT Errors
const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

// Send error response in development
const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send error response in production
const sendErrorProd = (err: AppError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
};

// Main error handler middleware
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: AppError;

  // Handle specific error types
  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof mongoose.Error.CastError) {
    error = handleCastErrorDB(err);
  } else if (err instanceof mongoose.Error.ValidationError) {
    error = handleValidationErrorDB(err);
  } else if ((err as any).code === 11000) {
    error = handleDuplicateFieldsDB(err);
  } else if ((err as any).name === 'JsonWebTokenError') {
    error = handleJWTError();
  } else if ((err as any).name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  } else {
    // Unknown error
    error = new AppError(err.message || 'Internal Server Error', 500);
    error.isOperational = false;
  }

  // Send appropriate error response based on environment
  if (env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// 404 Not Found handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

// Async error handler wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

