import { Router } from 'express';
import RequestRoutesInstance from '../modules/request/Request.routes';
import AnnouncementRoutesInstance from '../modules/announcement/Announcement.routes';
import AuthRoutesInstance from '../modules/auth/Auth.routes';
import UserRoutesInstance from '../modules/user/User.routes';
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
    // Auth Routes (public)
    this.router.use('/auth', AuthRoutesInstance);
    
    // User Routes (protected)
    this.router.use('/users', UserRoutesInstance);
    
    // API Routes
    this.router.use('/requests', RequestRoutesInstance);
    // this.router.use('/announcements', AnnouncementRoutesInstance);
    // this.router.use('/chat', ChatRoutesInstance);
    // this.router.use('/analytics', AnalyticsRoutesInstance);
    // this.router.use('/notifications', NotificationRoutesInstance);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new ApiRoutes().getRouter();

