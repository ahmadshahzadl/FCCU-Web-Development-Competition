import { AIConfig, IAIConfig } from './AI.model';
import { NotFoundError, ValidationError } from '../../middleware/errorHandler';
import { env } from '../../config/env';
import axios from 'axios';

export class AIService {
  // Get current system prompt (admin only)
  async getSystemPrompt(): Promise<string> {
    const config = await AIConfig.findOne();

    if (!config) {
      throw new NotFoundError('AI configuration not found. Please run the seeder.');
    }

    return config.systemPrompt;
  }

  // Update system prompt (admin only)
  async updateSystemPrompt(newPrompt: string): Promise<IAIConfig> {
    if (!newPrompt || typeof newPrompt !== 'string' || newPrompt.trim().length === 0) {
      throw new ValidationError('System prompt is required and must be a non-empty string');
    }

    let config = await AIConfig.findOne();

    if (!config) {
      // Create config if it doesn't exist
      config = await AIConfig.create({
        systemPrompt: newPrompt.trim(),
      });
    } else {
      // Update existing config
      config.systemPrompt = newPrompt.trim();
      await config.save();
    }

    return config;
  }

  // Call Gemini API for chat
  async callGeminiAPI(userMessage: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<string> {
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      throw new ValidationError('User message is required');
    }

    // Get system prompt from database
    const systemPrompt = await this.getSystemPrompt();

    try {
      // Prepare the request payload for Gemini API
      const contents: any[] = [];

      // Add system instruction as first part
      contents.push({
        parts: [{ text: systemPrompt }],
        role: 'user',
      });

      // Add conversation history if provided
      if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.forEach((msg) => {
          contents.push({
            parts: [{ text: msg.content }],
            role: msg.role === 'user' ? 'user' : 'model',
          });
        });
      }

      // Add current user message
      contents.push({
        parts: [{ text: userMessage.trim() }],
        role: 'user',
      });

      // Call Gemini API
      const response = await axios.post(
        `${env.GEMINI_API_URL}?key=${env.GEMINI_API_KEY}`,
        {
          contents: contents,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      // Extract response text
      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates.length > 0 &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts.length > 0
      ) {
        return response.data.candidates[0].content.parts[0].text;
      }

      throw new Error('Invalid response format from Gemini API');
    } catch (error: any) {
      // Handle API errors
      if (error.response) {
        // API returned an error response
        const errorMessage = error.response.data?.error?.message || 'Gemini API error';
        throw new ValidationError(`AI service error: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new ValidationError('AI service is temporarily unavailable. Please try again later.');
      } else {
        // Error in setting up the request
        throw new ValidationError(`Failed to process AI request: ${error.message}`);
      }
    }
  }
}

