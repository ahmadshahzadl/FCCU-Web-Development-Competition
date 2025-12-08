import { Router } from 'express';
import { UserController } from './User.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { apiLimiter, strictLimiter } from '../../middleware';
import type { UserRole } from '../auth/types';

export class UserRoutes {
  private router: Router;
  private controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All routes require authentication
    this.router.use(authenticate);

    // Get current user profile (all authenticated users)
    // IMPORTANT: This must come BEFORE /:id route to avoid "me" being treated as an ID
    this.router.get('/me', apiLimiter, this.controller.getCurrentUser);

    // Update current user profile (all authenticated users)
    // IMPORTANT: This must come BEFORE /:id route to avoid "me" being treated as an ID
    this.router.put('/me', strictLimiter, this.controller.updateCurrentUser);

    // Get all users (admin and manager only)
    this.router.get(
      '/',
      apiLimiter,
      authorize('admin', 'manager'),
      this.controller.getAllUsers
    );

    // Get user by ID (admin and manager only)
    this.router.get(
      '/:id',
      apiLimiter,
      authorize('admin', 'manager'),
      this.controller.getUserById
    );

    // Create user (admin and manager only)
    this.router.post(
      '/',
      strictLimiter,
      authorize('admin', 'manager'),
      this.controller.createUser
    );

    // Update user (admin and manager only)
    this.router.put(
      '/:id',
      strictLimiter,
      authorize('admin', 'manager'),
      this.controller.updateUser
    );

    // Delete user (admin and manager only)
    this.router.delete(
      '/:id',
      strictLimiter,
      authorize('admin', 'manager'),
      this.controller.deleteUser
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new UserRoutes().getRouter();

