import { Router } from 'express';
import { CampusMapController } from './CampusMap.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { lenientLimiter, strictLimiter } from '../../middleware';

export class CampusMapRoutes {
  private router: Router;
  private controller: CampusMapController;

  constructor() {
    this.router = Router();
    this.controller = new CampusMapController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All routes require authentication
    this.router.use(authenticate);

    // Admin-only routes (must come before /:id route to avoid route conflicts)
    this.router.get(
      '/admin/all',
      lenientLimiter,
      authorize('admin'),
      this.controller.getAllMarkersAdmin
    );
    this.router.get(
      '/admin/statistics',
      lenientLimiter,
      authorize('admin'),
      this.controller.getStatistics
    );
    this.router.post(
      '/',
      strictLimiter,
      authorize('admin'),
      this.controller.createMarker
    );
    this.router.put(
      '/:id',
      strictLimiter,
      authorize('admin'),
      this.controller.updateMarker
    );
    this.router.delete(
      '/:id',
      strictLimiter,
      authorize('admin'),
      this.controller.deleteMarker
    );

    // Authenticated routes - Get active markers
    // Use lenient limiter since map markers are frequently accessed
    // These routes must come after admin routes to avoid route conflicts
    this.router.get('/', lenientLimiter, this.controller.getAllMarkers);
    this.router.get('/category/:category', lenientLimiter, this.controller.getMarkersByCategory);
    this.router.get('/:id', lenientLimiter, this.controller.getMarkerById);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new CampusMapRoutes().getRouter();

