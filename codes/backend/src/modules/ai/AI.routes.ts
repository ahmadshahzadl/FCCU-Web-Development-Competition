import { Router } from 'express';
import { AIController } from './AI.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

export class AIRoutes {
  private router: Router;
  private controller: AIController;

  constructor() {
    this.router = Router();
    this.controller = new AIController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Chat endpoint - requires authentication (all authenticated users can chat)
    this.router.post('/chat', authenticate, this.controller.chat);

    // System prompt management - admin only
    this.router.use(authenticate);
    this.router.use(authorize('admin'));

    // Get current system prompt
    this.router.get('/system-prompt', this.controller.getSystemPrompt);

    // Update system prompt
    this.router.put('/system-prompt', this.controller.updateSystemPrompt);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new AIRoutes().getRouter();

