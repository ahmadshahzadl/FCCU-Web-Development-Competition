import mongoose, { Schema, Document } from 'mongoose';

export type RequestCategory = 'maintenance' | 'academic' | 'lost-found' | 'general';
export type RequestStatus = 'pending' | 'in-progress' | 'resolved';

export interface IRequest extends Document {
  category: RequestCategory;
  description: string;
  status: RequestStatus;
  studentId?: string;
  studentName?: string;
  attachmentUrl?: string;
  adminNotes?: string;
  resolvedAt?: Date;
  createdBy?: string; // Username of user who created this request
  deletedBy?: string; // Username of user who deleted this request
  deletedAt?: Date; // When request was deleted
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema: Schema = new Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['maintenance', 'academic', 'lost-found', 'general'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
    studentId: {
      type: String,
      trim: true,
    },
    studentName: {
      type: String,
      trim: true,
    },
    attachmentUrl: {
      type: String,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    resolvedAt: {
      type: Date,
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

// Indexes
RequestSchema.index({ studentId: 1 });
RequestSchema.index({ status: 1 });
RequestSchema.index({ category: 1 });
RequestSchema.index({ createdAt: -1 });
RequestSchema.index({ createdBy: 1 }); // Index for audit queries
RequestSchema.index({ deletedBy: 1 }); // Index for audit queries

export const Request = mongoose.model<IRequest>(
  'ServiceRequest',
  RequestSchema
);

