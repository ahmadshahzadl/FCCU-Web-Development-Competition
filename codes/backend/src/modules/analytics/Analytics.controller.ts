import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './Analytics.service';
import { asyncHandler } from '../../middleware/errorHandler';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getRequestStatistics = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const statistics = await this.analyticsService.getRequestStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
      });
    }
  );

  getCurrentMonthCategoryChart = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const chartData = await this.analyticsService.getCurrentMonthCategoryChart();

      res.status(200).json({
        success: true,
        data: chartData,
      });
    }
  );

  getCurrentMonthStatusChart = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const chartData = await this.analyticsService.getCurrentMonthStatusChart();

      res.status(200).json({
        success: true,
        data: chartData,
      });
    }
  );

  getCurrentMonthDailyChart = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const chartData = await this.analyticsService.getCurrentMonthDailyChart();

      res.status(200).json({
        success: true,
        data: chartData,
      });
    }
  );

  getAnalyticsSummary = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const summary = await this.analyticsService.getAnalyticsSummary();

      res.status(200).json({
        success: true,
        data: summary,
      });
    }
  );
}

