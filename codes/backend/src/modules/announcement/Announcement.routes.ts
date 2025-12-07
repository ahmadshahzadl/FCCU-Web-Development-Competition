import { Router } from 'express';
import { AnnouncementController } from './Announcement.controller';

export class AnnouncementRoutes {
  private router: Router;
  private controller: AnnouncementController;

  constructor() {
    this.router = Router();
    this.controller = new AnnouncementController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get all announcements
    this.router.get('/', this.controller.getAnnouncements);

    // Get announcement by ID
    this.router.get('/:id', this.controller.getAnnouncementById);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new AnnouncementRoutes().getRouter();
