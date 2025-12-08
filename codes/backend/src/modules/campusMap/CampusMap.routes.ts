import { Router } from 'express';
import { CampusMapController } from './CampusMap.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

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

    // Authenticated routes - Get active markers
    this.router.get('/', this.controller.getAllMarkers);
    this.router.get('/category/:category', this.controller.getMarkersByCategory);
    this.router.get('/:id', this.controller.getMarkerById);

    // Admin-only routes
    this.router.get(
      '/admin/all',
      authorize('admin'),
      this.controller.getAllMarkersAdmin
    );
    this.router.post(
      '/',
      authorize('admin'),
      this.controller.createMarker
    );
    this.router.put(
      '/:id',
      authorize('admin'),
      this.controller.updateMarker
    );
    this.router.delete(
      '/:id',
      authorize('admin'),
      this.controller.deleteMarker
    );
    this.router.get(
      '/admin/statistics',
      authorize('admin'),
      this.controller.getStatistics
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new CampusMapRoutes().getRouter();

