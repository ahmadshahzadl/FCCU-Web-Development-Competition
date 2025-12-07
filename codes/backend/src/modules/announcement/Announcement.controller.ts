import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from './Announcement.service';
import { asyncHandler } from '../../middleware/errorHandler';

export class AnnouncementController {
  private announcementService: AnnouncementService;

  constructor() {
    this.announcementService = new AnnouncementService();
  }

  getAnnouncements = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const announcements = await this.announcementService.getAllAnnouncements();

      res.status(200).json({
        success: true,
        data: announcements,
      });
    }
  );

  getAnnouncementById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const announcement = await this.announcementService.getAnnouncementById(id);

      res.status(200).json({
        success: true,
        data: announcement,
      });
    }
  );
}
