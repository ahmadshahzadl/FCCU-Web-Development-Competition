import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from './errorHandler';
import { User } from '../modules/user/User.model';
import type { JWTPayload, UserRole } from '../modules/auth/types';

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        name?: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Authentication middleware - Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided. Please log in.');
    }

    // Extract token
    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedError('No token provided. Please log in.');
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new UnauthorizedError('User belonging to this token no longer exists.');
    }

    // Attach user to request object
    req.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token. Please log in again.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Your token has expired. Please log in again.'));
    }
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('You must be logged in to access this resource.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new UnauthorizedError(
          `You do not have permission to perform this action. Required roles: ${allowedRoles.join(', ')}`
        )
      );
    }

    next();
  };
};

