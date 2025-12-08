import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from './Announcement.service';
import { asyncHandler, ValidationError } from '../../middleware/errorHandler';
import { getSocketService } from '../../utils/socket';
import mongoose from 'mongoose';

export class AnnouncementController {
  private announcementService: AnnouncementService;

  constructor() {
    this.announcementService = new AnnouncementService();
  }

  // Get user's announcements (all authenticated users)
  getUserAnnouncements = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const announcements = await this.announcementService.getUserAnnouncements(
        req.user.id,
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: announcements,
      });
    }
  );

  // Get unread announcements for user
  getUnreadAnnouncements = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const announcements = await this.announcementService.getUnreadAnnouncements(
        req.user.id,
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: announcements,
      });
    }
  );

  // Get unread count
  getUnreadCount = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const count = await this.announcementService.getUnreadCount(
        req.user.id,
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: { count },
      });
    }
  );

  // Get all announcements (admin/manager only)
  getAllAnnouncements = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const announcements = await this.announcementService.getAllAnnouncements();

      res.status(200).json({
        success: true,
        data: announcements,
      });
    }
  );

  // Get announcement by ID
  getAnnouncementById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid announcement ID format');
      }

      const announcement = await this.announcementService.getAnnouncementById(id);

      res.status(200).json({
        success: true,
        data: announcement,
      });
    }
  );

  // Create announcement (admin/manager only)
  createAnnouncement = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const { title, content, type, priority, target, targetRoles, targetUserIds, relatedRequestId } = req.body;

      if (!title || !content || !target) {
        throw new ValidationError('Title, content, and target are required');
      }

      const announcement = await this.announcementService.createAnnouncement(
        {
          title,
          content,
          type,
          priority,
          target,
          targetRoles,
          targetUserIds,
          relatedRequestId,
        },
        req.user.username,
        req.user.role
      );

      // Emit socket event for new announcement
      try {
        const socketService = getSocketService();
        socketService.notifyAnnouncementCreated(announcement);
      } catch (error) {
        console.error('[AnnouncementController] Failed to emit socket event:', error);
      }

      res.status(201).json({
        success: true,
        data: announcement,
        message: 'Announcement created successfully',
      });
    }
  );

  // Mark announcement as read
  markAsRead = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid announcement ID format');
      }

      const announcement = await this.announcementService.markAsRead(id, req.user.id);

      res.status(200).json({
        success: true,
        data: announcement,
        message: 'Announcement marked as read',
      });
    }
  );

  // Mark all announcements as read
  markAllAsRead = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      await this.announcementService.markAllAsRead(req.user.id, req.user.role);

      res.status(200).json({
        success: true,
        message: 'All announcements marked as read',
      });
    }
  );

  // Delete announcement (admin/manager only)
  deleteAnnouncement = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid announcement ID format');
      }

      await this.announcementService.deleteAnnouncement(id);

      // Emit socket event for deleted announcement
      try {
        const socketService = getSocketService();
        socketService.notifyAnnouncementDeleted(id);
      } catch (error) {
        console.error('[AnnouncementController] Failed to emit socket event:', error);
      }

      res.status(200).json({
        success: true,
        message: 'Announcement deleted successfully',
      });
    }
  );
}
