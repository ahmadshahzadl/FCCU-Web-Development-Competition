import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'manager' | 'team' | 'student';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  name?: string;
  role: UserRole;
  createdBy?: string; // Username of user who created this user
  deletedBy?: string; // Username of user who deleted this user
  deletedAt?: Date; // When user was deleted
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'team', 'student'],
      required: [true, 'Role is required'],
      default: 'student',
    },
    createdBy: {
      type: String,
      trim: true,
      lowercase: true,
    },
    deletedBy: {
      type: String,
      trim: true,
      lowercase: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const password = String(this.password);
    const hashedPassword = await bcrypt.hash(password, 12);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
// Note: email and username indexes are created automatically by unique: true
UserSchema.index({ role: 1 });
UserSchema.index({ createdBy: 1 }); // Index for audit queries
UserSchema.index({ deletedBy: 1 }); // Index for audit queries

export const User = mongoose.model<IUser>('User', UserSchema);

