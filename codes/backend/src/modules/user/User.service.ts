import { User, IUser } from './User.model';
import { NotFoundError, ConflictError, ValidationError } from '../../middleware/errorHandler';
import type { CreateUserInput, UpdateUserInput, UserRole } from '../auth/types';
import bcrypt from 'bcryptjs';
import { env } from '../../config/env';
import { SystemConfigService } from '../systemConfig/SystemConfig.service';

export class UserService {
  private systemConfigService: SystemConfigService;

  constructor() {
    this.systemConfigService = new SystemConfigService();
  }

  // Get all users with filters and pagination
  async getAllUsers(
    query: any,
    page: number = 1,
    limit: number = 10,
    currentUserRole: UserRole
  ) {
    // Apply role-based filtering
    const roleFilter: any = {};
    
    if (currentUserRole === 'admin') {
      // Admin can see all users
    } else if (currentUserRole === 'manager') {
      // Manager can only see team and student
      roleFilter.role = { $in: ['team', 'student'] };
    } else {
      // Team and student cannot access this endpoint (should be blocked by middleware)
      throw new ValidationError('You do not have permission to view users');
    }

    // Exclude God User and deleted users from results
    const godUserFilter = {
      $nor: [
        { email: env.GOD_USER_EMAIL.toLowerCase() },
        { username: env.GOD_USER_USERNAME.toLowerCase() }
      ]
    };

    // Exclude soft-deleted users
    const activeUserFilter = {
      deletedAt: { $exists: false }
    };

    const skip = (page - 1) * limit;
    const finalQuery = { ...query, ...roleFilter, ...godUserFilter, ...activeUserFilter };

    const users = await User.find(finalQuery)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(finalQuery);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get current user profile
  async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  // Update current user profile
  async updateCurrentUser(
    userId: string,
    updateData: UpdateUserInput,
    currentUserRole: UserRole
  ): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent updating God User
    if (
      user.email.toLowerCase() === env.GOD_USER_EMAIL.toLowerCase() ||
      user.username.toLowerCase() === env.GOD_USER_USERNAME.toLowerCase()
    ) {
      throw new ValidationError('Cannot update God User');
    }

    // Only admin can update email or username
    if (currentUserRole !== 'admin') {
      if (updateData.email || updateData.username) {
        throw new ValidationError('Email and username cannot be changed');
      }
    }

    // Check if email is being updated and already exists
    if (updateData.email && updateData.email.toLowerCase() !== user.email) {
      const existingEmail = await User.findOne({
        email: updateData.email.toLowerCase(),
      });
      if (existingEmail) {
        throw new ConflictError('Email already exists');
      }
      updateData.email = updateData.email.toLowerCase();
    }

    // Check if username is being updated and already exists
    if (updateData.username && updateData.username.toLowerCase() !== user.username) {
      const existingUsername = await User.findOne({
        username: updateData.username.toLowerCase(),
      });
      if (existingUsername) {
        throw new ConflictError('Username already exists');
      }
      updateData.username = updateData.username.toLowerCase();
    }

    // Hash password if being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;
  }

  // Get user by ID
  async getUserById(id: string, currentUserRole: UserRole): Promise<IUser> {
    const user = await User.findOne({
      _id: id,
      deletedAt: { $exists: false }, // Exclude soft-deleted users
    })
      .select('-password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Role-based access control
    if (currentUserRole === 'manager' && !['team', 'student'].includes(user.role)) {
      throw new ValidationError('You do not have permission to view this user');
    }

    if (['team', 'student'].includes(currentUserRole)) {
      throw new ValidationError('You do not have permission to view users');
    }

    return user;
  }

  // Create new user
  async createUser(
    data: CreateUserInput,
    currentUserRole: UserRole,
    currentUserUsername: string
  ): Promise<IUser> {
    // Role-based access control
    if (currentUserRole === 'manager') {
      if (!['team', 'student'].includes(data.role)) {
        throw new ValidationError('Manager can only create team and student users');
      }
      
      // Validate email domain for managers
      const isValidDomain = await this.systemConfigService.validateEmailDomain(data.email);
      if (!isValidDomain) {
        const config = await this.systemConfigService.getConfig();
        throw new ValidationError(
          `Email domain not allowed. Allowed domains: ${config.allowedEmailDomains.join(', ') || 'None configured. Please contact admin.'}`
        );
      }
    } else if (currentUserRole !== 'admin') {
      throw new ValidationError('You do not have permission to create users');
    }

    // Check if email already exists (excluding soft-deleted users)
    const existingEmail = await User.findOne({
      email: data.email.toLowerCase(),
      deletedAt: { $exists: false },
    });
    if (existingEmail) {
      throw new ConflictError('Email already exists');
    }

    // Check if username already exists (excluding soft-deleted users)
    const existingUsername = await User.findOne({
      username: data.username.toLowerCase(),
      deletedAt: { $exists: false },
    });
    if (existingUsername) {
      throw new ConflictError('Username already exists');
    }

    // Create user with audit log
    const user = await User.create({
      ...data,
      email: data.email.toLowerCase(),
      username: data.username.toLowerCase(),
      createdBy: currentUserUsername.toLowerCase(), // Audit: Track who created this user (username)
    });

    return user;
  }

  // Update user
  async updateUser(
    id: string,
    updateData: UpdateUserInput,
    currentUserRole: UserRole
  ): Promise<IUser> {
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent updating God User
    if (
      user.email.toLowerCase() === env.GOD_USER_EMAIL.toLowerCase() ||
      user.username.toLowerCase() === env.GOD_USER_USERNAME.toLowerCase()
    ) {
      throw new ValidationError('Cannot update God User');
    }

    // Role-based access control
    if (currentUserRole === 'manager') {
      if (!['team', 'student'].includes(user.role)) {
        throw new ValidationError('Manager can only update team and student users');
      }
      // Manager cannot change role
      if (updateData.role && updateData.role !== user.role) {
        throw new ValidationError('Manager cannot change user roles');
      }
    } else if (currentUserRole !== 'admin') {
      throw new ValidationError('You do not have permission to update users');
    }

    // Check if email is being updated and already exists (excluding soft-deleted users)
    if (updateData.email && updateData.email.toLowerCase() !== user.email) {
      const existingEmail = await User.findOne({
        email: updateData.email.toLowerCase(),
        deletedAt: { $exists: false },
      });
      if (existingEmail) {
        throw new ConflictError('Email already exists');
      }
      updateData.email = updateData.email.toLowerCase();
    }

    // Check if username is being updated and already exists (excluding soft-deleted users)
    if (updateData.username && updateData.username.toLowerCase() !== user.username) {
      const existingUsername = await User.findOne({
        username: updateData.username.toLowerCase(),
        deletedAt: { $exists: false },
      });
      if (existingUsername) {
        throw new ConflictError('Username already exists');
      }
      updateData.username = updateData.username.toLowerCase();
    }

    // Hash password if being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;
  }

  // Delete user
  async deleteUser(
    id: string,
    currentUserRole: UserRole,
    currentUserUsername: string
  ): Promise<void> {
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent deleting God User
    if (
      user.email.toLowerCase() === env.GOD_USER_EMAIL.toLowerCase() ||
      user.username.toLowerCase() === env.GOD_USER_USERNAME.toLowerCase()
    ) {
      throw new ValidationError('Cannot delete God User');
    }

    // Role-based access control
    if (currentUserRole === 'manager') {
      if (!['team', 'student'].includes(user.role)) {
        throw new ValidationError('Manager can only delete team and student users');
      }
    } else if (currentUserRole !== 'admin') {
      throw new ValidationError('You do not have permission to delete users');
    }

    // Soft delete: Mark as deleted with audit info instead of hard delete
    await User.findByIdAndUpdate(
      id,
      {
        deletedBy: currentUserUsername.toLowerCase(), // Audit: Track who deleted this user (username)
        deletedAt: new Date(),
      },
      { new: true }
    );
  }
}

