import { Router } from 'express';
import { SystemConfigController } from './SystemConfig.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

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
    this.router.get('/public', this.controller.getPublicConfig);

    // All update operations require admin authentication
    this.router.use(authenticate);
    this.router.use(authorize('admin'));

    // Get system configuration (admin only - includes email domains)
    this.router.get('/', this.controller.getConfig);

    

    // Update project name
    this.router.put('/name', this.controller.updateProjectName);

    // Update logo
    this.router.put('/logo', this.controller.updateLogo);

    // Add email domain
    this.router.post('/email-domains', this.controller.addEmailDomain);

    // Remove email domain
    this.router.delete('/email-domains', this.controller.removeEmailDomain);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new SystemConfigRoutes().getRouter();

