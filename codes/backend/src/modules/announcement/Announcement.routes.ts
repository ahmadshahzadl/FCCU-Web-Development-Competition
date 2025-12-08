import { Router } from 'express';
import { AnnouncementController } from './Announcement.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { apiLimiter, strictLimiter, lenientLimiter } from '../../middleware';

export class AnnouncementRoutes {
  private router: Router;
  private controller: AnnouncementController;

  constructor() {
    this.router = Router();
    this.controller = new AnnouncementController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All routes require authentication
    this.router.use(authenticate);

    // User-specific routes (must come before /:id route)
    // Use lenient limiter for frequently accessed user announcement endpoints
    this.router.get('/me', lenientLimiter, this.controller.getUserAnnouncements);
    this.router.get('/me/unread', lenientLimiter, this.controller.getUnreadAnnouncements);
    // Use lenient limiter for frequently polled unread-count endpoint
    this.router.get('/me/unread-count', lenientLimiter, this.controller.getUnreadCount);
    this.router.put('/me/read-all', lenientLimiter, this.controller.markAllAsRead);

    // Mark announcement as read (must come before /:id route)
    this.router.put('/:id/read', apiLimiter, this.controller.markAsRead);

    // Admin/Manager routes
    this.router.get('/', apiLimiter, authorize('admin', 'manager'), this.controller.getAllAnnouncements);
    this.router.post('/', strictLimiter, authorize('admin', 'manager'), this.controller.createAnnouncement);
    this.router.delete('/:id', strictLimiter, authorize('admin', 'manager'), this.controller.deleteAnnouncement);

    // Get announcement by ID (must be last)
    this.router.get('/:id', apiLimiter, this.controller.getAnnouncementById);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new AnnouncementRoutes().getRouter();
