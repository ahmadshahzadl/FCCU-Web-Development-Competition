import { Request, Response, NextFunction } from 'express';
import { CampusMapService, CreateMarkerInput, UpdateMarkerInput } from './CampusMap.service';
import { asyncHandler, ValidationError } from '../../middleware/errorHandler';

export class CampusMapController {
  private campusMapService: CampusMapService;

  constructor() {
    this.campusMapService = new CampusMapService();
  }

  // Get all active markers (public - can filter by category)
  getAllMarkers = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const category = req.query.category as string | undefined;
      const markers = await this.campusMapService.getAllMarkers(category as any);

      res.status(200).json({
        success: true,
        data: markers,
        count: markers.length,
      });
    }
  );

  // Get all markers including inactive (admin only)
  getAllMarkersAdmin = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const category = req.query.category as string | undefined;
      const markers = await this.campusMapService.getAllMarkersAdmin(category as any);

      res.status(200).json({
        success: true,
        data: markers,
        count: markers.length,
      });
    }
  );

  // Get marker by ID
  getMarkerById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const marker = await this.campusMapService.getMarkerById(id);

      res.status(200).json({
        success: true,
        data: marker,
      });
    }
  );

  // Create marker (admin only)
  createMarker = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const {
        name,
        category,
        description,
        latitude,
        longitude,
        address,
        contactInfo,
        openingHours,
        icon,
        isActive,
      } = req.body;

      // Validation
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new ValidationError('Name is required and must be a non-empty string');
      }

      if (!category || typeof category !== 'string') {
        throw new ValidationError('Category is required');
      }

      if (typeof latitude !== 'number' || isNaN(latitude)) {
        throw new ValidationError('Latitude is required and must be a number');
      }

      if (typeof longitude !== 'number' || isNaN(longitude)) {
        throw new ValidationError('Longitude is required and must be a number');
      }

      const markerData: CreateMarkerInput = {
        name,
        category: category.trim(),
        description,
        latitude,
        longitude,
        address,
        contactInfo,
        openingHours,
        icon,
        isActive,
      };

      const marker = await this.campusMapService.createMarker(markerData);

      res.status(201).json({
        success: true,
        data: marker,
        message: 'Marker created successfully',
      });
    }
  );

  // Update marker (admin only)
  updateMarker = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const {
        name,
        category,
        description,
        latitude,
        longitude,
        address,
        contactInfo,
        openingHours,
        icon,
        isActive,
      } = req.body;

      // Category validation is handled in the service layer

      // Validate coordinates if provided
      if (latitude !== undefined && (typeof latitude !== 'number' || isNaN(latitude))) {
        throw new ValidationError('Latitude must be a number');
      }

      if (longitude !== undefined && (typeof longitude !== 'number' || isNaN(longitude))) {
        throw new ValidationError('Longitude must be a number');
      }

      const updateData: UpdateMarkerInput = {
        name,
        category: category ? (category.toLowerCase() as any) : undefined,
        description,
        latitude,
        longitude,
        address,
        contactInfo,
        openingHours,
        icon,
        isActive,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(
        (key) =>
          updateData[key as keyof UpdateMarkerInput] === undefined &&
          delete updateData[key as keyof UpdateMarkerInput]
      );

      const marker = await this.campusMapService.updateMarker(id, updateData);

      res.status(200).json({
        success: true,
        data: marker,
        message: 'Marker updated successfully',
      });
    }
  );

  // Delete marker (admin only)
  deleteMarker = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      await this.campusMapService.deleteMarker(id);

      res.status(200).json({
        success: true,
        message: 'Marker deleted successfully',
      });
    }
  );

  // Get markers by category (public endpoint)
  getMarkersByCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { category } = req.params;
      const markers = await this.campusMapService.getMarkersByCategory(category as any);

      res.status(200).json({
        success: true,
        data: markers,
        count: markers.length,
      });
    }
  );

  // Get marker statistics (admin only)
  getStatistics = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const statistics = await this.campusMapService.getMarkerStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
      });
    }
  );
}

