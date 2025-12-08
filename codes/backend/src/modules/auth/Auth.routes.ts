import { Router } from 'express';
import { AuthController } from './Auth.controller';
import { signinLimiter } from '../../middleware';

export class AuthRoutes {
  private router: Router;
  private controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Sign in with email and password (with specific rate limiter)
    this.router.post('/signin', signinLimiter, this.controller.signIn);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new AuthRoutes().getRouter();

