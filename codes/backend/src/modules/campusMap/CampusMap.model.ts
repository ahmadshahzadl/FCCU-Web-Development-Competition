import mongoose, { Schema, Document } from 'mongoose';

export interface ICampusMapMarker extends Document {
  name: string;
  category: string; // Category name (e.g., "Academic Building", "Hostel", "Library")
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  contactInfo?: string;
  openingHours?: string;
  isActive: boolean;
  icon?: string; // Optional custom icon name/URL (overrides category icon)
  createdAt: Date;
  updatedAt: Date;
}

const CampusMapMarkerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Marker name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    address: {
      type: String,
      trim: true,
    },
    contactInfo: {
      type: String,
      trim: true,
    },
    openingHours: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
CampusMapMarkerSchema.index({ category: 1 });
CampusMapMarkerSchema.index({ isActive: 1 });
CampusMapMarkerSchema.index({ latitude: 1, longitude: 1 }); // Geospatial queries

// Compound index for filtering active markers by category
CampusMapMarkerSchema.index({ category: 1, isActive: 1 });

export const CampusMapMarker = mongoose.model<ICampusMapMarker>(
  'CampusMapMarker',
  CampusMapMarkerSchema
);

