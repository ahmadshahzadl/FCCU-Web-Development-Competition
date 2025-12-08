import { User, IUser } from '../auth/User.model';
import { NotFoundError, ConflictError, ValidationError } from '../../middleware/errorHandler';
import type { CreateUserInput, UpdateUserInput, UserRole } from '../auth/types';
import bcrypt from 'bcryptjs';
import { env } from '../../config/env';

export class UserService {
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

    // Exclude God User from results (hidden from all user listings)
    const godUserFilter = {
      $nor: [
        { email: env.GOD_USER_EMAIL.toLowerCase() },
        { username: env.GOD_USER_USERNAME.toLowerCase() }
      ]
    };

    const skip = (page - 1) * limit;
    const finalQuery = { ...query, ...roleFilter, ...godUserFilter };

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

  // Get user by ID
  async getUserById(id: string, currentUserRole: UserRole): Promise<IUser> {
    const user = await User.findById(id).select('-password');

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
  async createUser(data: CreateUserInput, currentUserRole: UserRole): Promise<IUser> {
    // Role-based access control
    if (currentUserRole === 'manager') {
      if (!['team', 'student'].includes(data.role)) {
        throw new ValidationError('Manager can only create team and student users');
      }
    } else if (currentUserRole !== 'admin') {
      throw new ValidationError('You do not have permission to create users');
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: data.email.toLowerCase() });
    if (existingEmail) {
      throw new ConflictError('Email already exists');
    }

    // Check if username already exists
    const existingUsername = await User.findOne({
      username: data.username.toLowerCase(),
    });
    if (existingUsername) {
      throw new ConflictError('Username already exists');
    }

    // Create user
    const user = await User.create({
      ...data,
      email: data.email.toLowerCase(),
      username: data.username.toLowerCase(),
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
  async deleteUser(id: string, currentUserRole: UserRole): Promise<void> {
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

    await User.findByIdAndDelete(id);
  }
}

