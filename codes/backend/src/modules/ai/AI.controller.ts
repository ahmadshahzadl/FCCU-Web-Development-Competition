import { Request, Response, NextFunction } from 'express';
import { AIService } from './AI.service';
import { asyncHandler, ValidationError } from '../../middleware/errorHandler';

export class AIController {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  getSystemPrompt = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const prompt = await this.aiService.getSystemPrompt();

      res.status(200).json({
        success: true,
        data: {
          systemPrompt: prompt,
        },
      });
    }
  );

  updateSystemPrompt = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { systemPrompt } = req.body;

      if (!systemPrompt) {
        throw new ValidationError('System prompt is required');
      }

      const config = await this.aiService.updateSystemPrompt(systemPrompt);

      res.status(200).json({
        success: true,
        data: {
          systemPrompt: config.systemPrompt,
          updatedAt: config.updatedAt,
        },
        message: 'System prompt updated successfully',
      });
    }
  );

  chat = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { message, conversationHistory } = req.body;

      if (!message) {
        throw new ValidationError('Message is required');
      }

      const response = await this.aiService.callGeminiAPI(message, conversationHistory);

      res.status(200).json({
        success: true,
        data: {
          response: response,
        },
      });
    }
  );
}

