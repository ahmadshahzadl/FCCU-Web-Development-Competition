import { Router } from 'express';
import { UserController } from './User.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
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

    // Get all users (admin and manager only)
    this.router.get(
      '/',
      authorize('admin', 'manager'),
      this.controller.getAllUsers
    );

    // Get user by ID (admin and manager only)
    this.router.get(
      '/:id',
      authorize('admin', 'manager'),
      this.controller.getUserById
    );

    // Create user (admin and manager only)
    this.router.post(
      '/',
      authorize('admin', 'manager'),
      this.controller.createUser
    );

    // Update user (admin and manager only)
    this.router.put(
      '/:id',
      authorize('admin', 'manager'),
      this.controller.updateUser
    );

    // Delete user (admin and manager only)
    this.router.delete(
      '/:id',
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

