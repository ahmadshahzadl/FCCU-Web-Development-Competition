import { Router } from 'express';
import RequestRoutesInstance from '../modules/request/Request.routes';
import AnnouncementRoutesInstance from '../modules/announcement/Announcement.routes';
import AuthRoutesInstance from '../modules/auth/Auth.routes';
// Import other module routes here as they are created
// import ChatRoutesInstance from '../modules/chat/Chat.routes';
// import AnalyticsRoutesInstance from '../modules/analytics/Analytics.routes';
// import NotificationRoutesInstance from '../modules/notification/Notification.routes';

class ApiRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Auth Routes
    this.router.use('/auth', AuthRoutesInstance);
    
    // API Routes
    this.router.use('/requests', RequestRoutesInstance);
    this.router.use('/announcements', AnnouncementRoutesInstance);
    // this.router.use('/chat', ChatRoutesInstance);
    // this.router.use('/analytics', AnalyticsRoutesInstance);
    // this.router.use('/notifications', NotificationRoutesInstance);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new ApiRoutes().getRouter();

