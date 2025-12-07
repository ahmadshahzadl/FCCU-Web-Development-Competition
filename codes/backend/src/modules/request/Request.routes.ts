import { Router } from 'express';
import { RequestController } from './Request.controller';
import { upload } from '../../middleware/uploadHandler';

export class RequestRoutes {
  private router: Router;
  private controller: RequestController;

  constructor() {
    this.router = Router();
    this.controller = new RequestController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get all requests with filters and pagination
    this.router.get('/', this.controller.getRequests);

    // Get request by ID
    this.router.get('/:id', this.controller.getRequestById);

    // Create new request (with file upload)
    this.router.post('/', upload.single('attachment'), this.controller.createRequest);

    // Update request
    this.router.put('/:id', this.controller.updateRequest);

    // Update request status
    this.router.put('/:id/status', this.controller.updateRequestStatus);

    // Delete request
    this.router.delete('/:id', this.controller.deleteRequest);

    // Get user's requests
    this.router.get('/user/:userId', this.controller.getUserRequests);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new RequestRoutes().getRouter();

