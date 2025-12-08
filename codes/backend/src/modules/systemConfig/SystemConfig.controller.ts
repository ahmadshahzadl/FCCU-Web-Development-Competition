import { Request, Response, NextFunction } from 'express';
import { SystemConfigService } from './SystemConfig.service';
import { asyncHandler, ValidationError } from '../../middleware/errorHandler';

export class SystemConfigController {
  private systemConfigService: SystemConfigService;

  constructor() {
    this.systemConfigService = new SystemConfigService();
  }

  getConfig = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const config = await this.systemConfigService.getConfig();

      res.status(200).json({
        success: true,
        data: config,
      });
    }
  );

  updateProjectName = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { projectName } = req.body;

      if (!projectName) {
        throw new ValidationError('Project name is required');
      }

      const config = await this.systemConfigService.updateConfig({
        projectName,
      });

      res.status(200).json({
        success: true,
        data: config,
        message: 'Project name updated successfully',
      });
    }
  );

  updateLogo = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { logo } = req.body;

      if (!logo) {
        throw new ValidationError('Logo is required');
      }

      // Validate base64 format
      if (typeof logo !== 'string') {
        throw new ValidationError('Logo must be a base64 string');
      }

      // Check if it's a valid base64 image format
      const base64Regex = /^data:image\/(png|jpg|jpeg|gif|svg\+xml|webp);base64,/i;
      if (!base64Regex.test(logo)) {
        throw new ValidationError(
          'Logo must be a valid base64 image. Supported formats: PNG, JPG, JPEG, GIF, SVG, WEBP'
        );
      }

      const config = await this.systemConfigService.updateConfig({
        logoUrl: logo, // Store base64 string in logoUrl field
      });

      res.status(200).json({
        success: true,
        data: config,
        message: 'Logo updated successfully',
      });
    }
  );

  addEmailDomain = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { domain } = req.body;

      if (!domain) {
        throw new ValidationError('Email domain is required');
      }

      const config = await this.systemConfigService.addEmailDomain(domain);

      res.status(200).json({
        success: true,
        data: config,
        message: 'Email domain added successfully',
      });
    }
  );

  removeEmailDomain = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { domain } = req.body;

      if (!domain) {
        throw new ValidationError('Email domain is required');
      }

      const config = await this.systemConfigService.removeEmailDomain(domain);

      res.status(200).json({
        success: true,
        data: config,
        message: 'Email domain removed successfully',
      });
    }
  );
}

