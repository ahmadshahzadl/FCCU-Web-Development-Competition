import { Router } from 'express';
import { CategoryController } from './Category.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { apiLimiter, strictLimiter } from '../../middleware';

export class CategoryRoutes {
  private router: Router;
  private controller: CategoryController;

  constructor() {
    this.router = Router();
    this.controller = new CategoryController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get all categories (public for authenticated users)
    this.router.get('/', authenticate, apiLimiter, this.controller.getAllCategories);

    // Get category by ID (public for authenticated users)
    this.router.get('/:id', authenticate, apiLimiter, this.controller.getCategoryById);

    // Create category (admin and manager only)
    this.router.post(
      '/',
      authenticate,
      strictLimiter,
      authorize('admin', 'manager'),
      this.controller.createCategory
    );

    // Update category (admin and manager only)
    this.router.put(
      '/:id',
      authenticate,
      strictLimiter,
      authorize('admin', 'manager'),
      this.controller.updateCategory
    );

    // Delete category (admin and manager only)
    this.router.delete(
      '/:id',
      authenticate,
      strictLimiter,
      authorize('admin', 'manager'),
      this.controller.deleteCategory
    );

    // Deactivate category (admin and manager only)
    this.router.put(
      '/:id/deactivate',
      authenticate,
      strictLimiter,
      authorize('admin', 'manager'),
      this.controller.deactivateCategory
    );

    // Activate category (admin and manager only)
    this.router.put(
      '/:id/activate',
      authenticate,
      strictLimiter,
      authorize('admin', 'manager'),
      this.controller.activateCategory
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new CategoryRoutes().getRouter();

