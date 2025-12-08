import { CampusMapMarker, ICampusMapMarker } from './CampusMap.model';
import { NotFoundError, ValidationError } from '../../middleware/errorHandler';

export interface CreateMarkerInput {
  name: string;
  category: string; // Category slug
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  contactInfo?: string;
  openingHours?: string;
  icon?: string;
  isActive?: boolean;
}

export interface UpdateMarkerInput {
  name?: string;
  category?: string; // Category slug
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  contactInfo?: string;
  openingHours?: string;
  icon?: string;
  isActive?: boolean;
}

export class CampusMapService {
  // Get all active markers (public endpoint)
  async getAllMarkers(category?: string): Promise<ICampusMapMarker[]> {
    const query: any = { isActive: true };

    if (category) {
      query.category = { $regex: new RegExp(category.trim(), 'i') }; // Case-insensitive search
    }

    const markers = await CampusMapMarker.find(query).sort({ name: 1 });

    return markers;
  }

  // Get all markers including inactive (admin only)
  async getAllMarkersAdmin(category?: string): Promise<ICampusMapMarker[]> {
    const query: any = {};

    if (category) {
      query.category = { $regex: new RegExp(category.trim(), 'i') }; // Case-insensitive search
    }

    const markers = await CampusMapMarker.find(query).sort({ name: 1 });

    return markers;
  }

  // Get marker by ID
  async getMarkerById(id: string): Promise<ICampusMapMarker> {
    const marker = await CampusMapMarker.findById(id);

    if (!marker) {
      throw new NotFoundError('Marker not found');
    }

    return marker;
  }

  // Create new marker (admin only)
  async createMarker(data: CreateMarkerInput): Promise<ICampusMapMarker> {
    // Validate coordinates
    if (data.latitude < -90 || data.latitude > 90) {
      throw new ValidationError('Latitude must be between -90 and 90');
    }

    if (data.longitude < -180 || data.longitude > 180) {
      throw new ValidationError('Longitude must be between -180 and 180');
    }

    // Check if marker with same name already exists
    const existingMarker = await CampusMapMarker.findOne({
      name: { $regex: new RegExp(`^${data.name}$`, 'i') },
    });

    if (existingMarker) {
      throw new ValidationError('Marker with this name already exists');
    }

    const marker = await CampusMapMarker.create({
      name: data.name.trim(),
      category: data.category.trim(),
      description: data.description?.trim(),
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address?.trim(),
      contactInfo: data.contactInfo?.trim(),
      openingHours: data.openingHours?.trim(),
      icon: data.icon?.trim(),
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    return marker;
  }

  // Update marker (admin only)
  async updateMarker(id: string, data: UpdateMarkerInput): Promise<ICampusMapMarker> {
    const marker = await CampusMapMarker.findById(id);

    if (!marker) {
      throw new NotFoundError('Marker not found');
    }

    // Validate coordinates if provided
    if (data.latitude !== undefined) {
      if (data.latitude < -90 || data.latitude > 90) {
        throw new ValidationError('Latitude must be between -90 and 90');
      }
      marker.latitude = data.latitude;
    }

    if (data.longitude !== undefined) {
      if (data.longitude < -180 || data.longitude > 180) {
        throw new ValidationError('Longitude must be between -180 and 180');
      }
      marker.longitude = data.longitude;
    }

    // Check for duplicate name if name is being updated
    if (data.name && data.name.trim() !== marker.name) {
      const existingMarker = await CampusMapMarker.findOne({
        name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') },
        _id: { $ne: id },
      });

      if (existingMarker) {
        throw new ValidationError('Marker with this name already exists');
      }
      marker.name = data.name.trim();
    }

    // Update other fields
    if (data.category !== undefined) {
      marker.category = data.category.trim().toLowerCase();
    }
    if (data.description !== undefined) {
      marker.description = data.description?.trim();
    }
    if (data.address !== undefined) {
      marker.address = data.address?.trim();
    }
    if (data.contactInfo !== undefined) {
      marker.contactInfo = data.contactInfo?.trim();
    }
    if (data.openingHours !== undefined) {
      marker.openingHours = data.openingHours?.trim();
    }
    if (data.icon !== undefined) {
      marker.icon = data.icon?.trim();
    }
    if (data.isActive !== undefined) {
      marker.isActive = data.isActive;
    }

    await marker.save();
    return marker;
  }

  // Delete marker (admin only)
  async deleteMarker(id: string): Promise<void> {
    const marker = await CampusMapMarker.findById(id);

    if (!marker) {
      throw new NotFoundError('Marker not found');
    }

    await CampusMapMarker.findByIdAndDelete(id);
  }

  // Get markers by category (public endpoint)
  async getMarkersByCategory(category: string): Promise<ICampusMapMarker[]> {
    const markers = await CampusMapMarker.find({
      category: { $regex: new RegExp(category.trim(), 'i') }, // Case-insensitive search
      isActive: true,
    }).sort({ name: 1 });

    return markers;
  }

  // Get marker statistics
  async getMarkerStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
    uniqueCategories: string[];
  }> {
    const total = await CampusMapMarker.countDocuments();
    const active = await CampusMapMarker.countDocuments({ isActive: true });
    const inactive = total - active;

    const categoryStats = await CampusMapMarker.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const byCategory: Record<string, number> = {};
    const uniqueCategories: string[] = [];
    
    categoryStats.forEach((stat) => {
      if (stat._id) {
        byCategory[stat._id] = stat.count;
        uniqueCategories.push(stat._id);
      }
    });

    return {
      total,
      active,
      inactive,
      byCategory,
      uniqueCategories,
    };
  }
}

