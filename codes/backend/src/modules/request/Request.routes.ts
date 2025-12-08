import { Router } from 'express';
import { RequestController } from './Request.controller';
import { upload } from '../../middleware/uploadHandler';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { requestsLimiter, strictLimiter } from '../../middleware';
import type { UserRole } from '../auth/types';

export class RequestRoutes {
  private router: Router;
  private controller: RequestController;

  constructor() {
    this.router = Router();
    this.controller = new RequestController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All routes require authentication
    this.router.use(authenticate);

    // Specific routes must come before parameterized routes
    
    // Get total request count (must be before /:id route)
    this.router.get('/count', requestsLimiter, this.controller.getRequestCount);

    // Get user's requests (must be before /:id route)
    this.router.get('/user/:userId', requestsLimiter, this.controller.getUserRequests);

    // Get all requests with filters and pagination (with rate limiter)
    this.router.get('/', requestsLimiter, this.controller.getRequests);

    // Create new request (with file upload) - All authenticated users can create
    this.router.post(
      '/',
      strictLimiter, // Apply strict limiter for create operations
      upload.single('attachment'),
      this.controller.createRequest
    );

    // Update request status (admin, manager, team only) - MUST come before PUT /:id
    this.router.put(
      '/:id/status',
      strictLimiter, // Apply strict limiter for update operations
      authorize('admin', 'manager', 'team'),
      this.controller.updateRequestStatus
    );

    // Update request
    this.router.put('/:id', strictLimiter, this.controller.updateRequest);

    // Delete request (admin, manager, team only)
    this.router.delete(
      '/:id',
      strictLimiter, // Apply strict limiter for delete operations
      authorize('admin', 'manager', 'team'),
      this.controller.deleteRequest
    );

    // Get request by ID (must be last to avoid conflicts)
    this.router.get('/:id', requestsLimiter, this.controller.getRequestById);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new RequestRoutes().getRouter();

