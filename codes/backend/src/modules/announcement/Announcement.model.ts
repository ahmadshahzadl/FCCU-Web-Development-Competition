import mongoose, { Schema, Document } from 'mongoose';

export type AnnouncementType = 'notice' | 'event' | 'cancellation';
export type AnnouncementPriority = 'high' | 'medium' | 'low';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  createdAt: Date;
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
      enum: ['notice', 'event', 'cancellation'],
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
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

export const Announcement = mongoose.model<IAnnouncement>(
  'Announcement',
  AnnouncementSchema
);

