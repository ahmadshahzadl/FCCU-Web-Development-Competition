import { User, IUser } from './User.model';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UnauthorizedError, NotFoundError } from '../../middleware/errorHandler';
import type { SignInInput, SignInResponse } from './types';
import { sanitizeEmail } from './Auth.validation';

export class AuthService {
  // Sign in with email and password
  async signIn(input: SignInInput): Promise<SignInResponse> {
    const { email, password } = input;

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    // Find user by email and include password field
    const user = await User.findOne({ email: sanitizedEmail }).select(
      '+password'
    );

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user._id.toString(), user.role);

    // Return user data (without password) and token
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  // Generate JWT token
  private generateToken(userId: string, role: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);
  }

  // Get user by ID (for future use, e.g., getting current user)
  async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

