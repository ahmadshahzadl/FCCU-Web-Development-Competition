import { Router } from 'express';
import RequestRoutesInstance from '../modules/request/Request.routes';
import AnnouncementRoutesInstance from '../modules/announcement/Announcement.routes';
import AuthRoutesInstance from '../modules/auth/Auth.routes';
import UserRoutesInstance from '../modules/user/User.routes';
import SystemConfigRoutesInstance from '../modules/systemConfig/SystemConfig.routes';
import CategoryRoutesInstance from '../modules/category/Category.routes';


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
    
    // System Config Routes
    this.router.use('/system-config', SystemConfigRoutesInstance);
    // Category Routes (protected)
    this.router.use('/categories', CategoryRoutesInstance);
    
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

