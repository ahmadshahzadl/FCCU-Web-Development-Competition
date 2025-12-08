import mongoose, { Schema, Document } from 'mongoose';
import type { UserRole } from '../auth/types';

export type AnnouncementType = 'notice' | 'event' | 'cancellation' | 'request-update';
export type AnnouncementPriority = 'high' | 'medium' | 'low';
export type AnnouncementTarget = 'all' | 'roles' | 'users';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  target: AnnouncementTarget; // 'all', 'roles', or 'users'
  targetRoles?: UserRole[]; // If target is 'roles', specify which roles
  targetUserIds?: string[]; // If target is 'users', specify user IDs
  createdBy: string; // Username of creator
  createdByRole: UserRole; // Role of creator
  relatedRequestId?: string; // If announcement is related to a request
  readBy?: string[]; // Array of user IDs who have read this
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['notice', 'event', 'cancellation', 'request-update'],
      default: 'notice',
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    target: {
      type: String,
      enum: ['all', 'roles', 'users'],
      required: [true, 'Target is required'],
      default: 'all',
    },
    targetRoles: {
      type: [String],
      enum: ['admin', 'manager', 'team', 'student'],
      default: [],
    },
    targetUserIds: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: String,
      required: [true, 'Created by is required'],
      trim: true,
      lowercase: true,
    },
    createdByRole: {
      type: String,
      enum: ['admin', 'manager', 'team', 'student'],
      required: [true, 'Created by role is required'],
    },
    relatedRequestId: {
      type: String,
      trim: true,
    },
    readBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AnnouncementSchema.index({ type: 1 });
AnnouncementSchema.index({ priority: 1 });
AnnouncementSchema.index({ createdAt: -1 });
AnnouncementSchema.index({ target: 1 });
AnnouncementSchema.index({ targetRoles: 1 });
AnnouncementSchema.index({ targetUserIds: 1 });
AnnouncementSchema.index({ createdBy: 1 });
AnnouncementSchema.index({ relatedRequestId: 1 });

export const Announcement = mongoose.model<IAnnouncement>(
  'Announcement',
  AnnouncementSchema
);

