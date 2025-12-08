import { Request, Response, NextFunction } from 'express';
import { UserService } from './User.service';
import { asyncHandler, ValidationError } from '../../middleware/errorHandler';
import type { CreateUserInput, UpdateUserInput } from '../auth/types';
import { validateAndSanitizeEmail, validatePassword } from '../auth/Auth.validation';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { role, page = 1, limit = 10 } = req.query;

      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const query: any = {};
      if (role) query.role = role;

      const result = await this.userService.getAllUsers(
        query,
        Number(page),
        Number(limit),
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  getUserById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;

      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const user = await this.userService.getUserById(id, req.user.role);

      res.status(200).json({
        success: true,
        data: user,
      });
    }
  );

  createUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email, username, password, name, role }: CreateUserInput = req.body;

      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      // Validate required fields
      if (!email || !username || !password || !role) {
        throw new ValidationError('Email, username, password, and role are required');
      }

      // Validate email
      const sanitizedEmail = validateAndSanitizeEmail(email);

      // Validate password
      const validatedPassword = validatePassword(password);

      // Validate username
      const sanitizedUsername = username.trim().toLowerCase();
      if (!sanitizedUsername || sanitizedUsername.length < 3) {
        throw new ValidationError('Username must be at least 3 characters long');
      }

      // Validate role
      const validRoles = ['admin', 'manager', 'team', 'student'];
      if (!validRoles.includes(role)) {
        throw new ValidationError(`Role must be one of: ${validRoles.join(', ')}`);
      }

      const newUser = await this.userService.createUser(
        {
          email: sanitizedEmail,
          username: sanitizedUsername,
          password: validatedPassword,
          name: name?.trim(),
          role,
        },
        req.user.role
      );

      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully',
      });
    }
  );

  updateUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const { email, username, password, name, role }: UpdateUserInput = req.body;

      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const updateData: UpdateUserInput = {};

      if (email) {
        updateData.email = validateAndSanitizeEmail(email);
      }

      if (username) {
        const sanitizedUsername = username.trim().toLowerCase();
        if (sanitizedUsername.length < 3) {
          throw new ValidationError('Username must be at least 3 characters long');
        }
        updateData.username = sanitizedUsername;
      }

      if (password) {
        updateData.password = validatePassword(password);
      }

      if (name !== undefined) {
        updateData.name = name?.trim();
      }

      if (role) {
        const validRoles = ['admin', 'manager', 'team', 'student'];
        if (!validRoles.includes(role)) {
          throw new ValidationError(`Role must be one of: ${validRoles.join(', ')}`);
        }
        updateData.role = role;
      }

      const updatedUser = await this.userService.updateUser(
        id,
        updateData,
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
      });
    }
  );

  deleteUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;

      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      await this.userService.deleteUser(id, req.user.role);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    }
  );
}

