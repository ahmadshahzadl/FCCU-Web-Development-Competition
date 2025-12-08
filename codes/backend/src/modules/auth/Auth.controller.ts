import { Request, Response, NextFunction } from 'express';
import { AuthService } from './Auth.service';
import { asyncHandler } from '../../middleware/errorHandler';
import { validateSignInInput } from './Auth.validation';
import type { SignInRequestBody } from './types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signIn = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email, password }: SignInRequestBody = req.body;

      // Validate input
      validateSignInInput(email, password);

      // Sign in user
      const result = await this.authService.signIn({ email, password });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Sign in successful',
      });
    }
  );
}

