import { Router } from 'express';
import { SystemConfigController } from './SystemConfig.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { lenientLimiter, strictLimiter } from '../../middleware';

export class SystemConfigRoutes {
  private router: Router;
  private controller: SystemConfigController;

  constructor() {
    this.router = Router();
    this.controller = new SystemConfigController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public route - Get system configuration (read-only, no auth required)
    // This allows all users to see project name and logo
    // Use lenient limiter since this is called frequently (on page load, app initialization, etc.)
    this.router.get('/public', lenientLimiter, this.controller.getPublicConfig);

    // All update operations require admin authentication
    this.router.use(authenticate);
    this.router.use(authorize('admin'));

    // Get system configuration (admin only - includes email domains)
    this.router.get('/', lenientLimiter, this.controller.getConfig);

    

    // Update project name
    this.router.put('/name', strictLimiter, this.controller.updateProjectName);

    // Update logo
    this.router.put('/logo', strictLimiter, this.controller.updateLogo);

    // Add email domain
    this.router.post('/email-domains', strictLimiter, this.controller.addEmailDomain);

    // Remove email domain
    this.router.delete('/email-domains', strictLimiter, this.controller.removeEmailDomain);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new SystemConfigRoutes().getRouter();

