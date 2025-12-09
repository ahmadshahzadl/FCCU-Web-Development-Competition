import { Router } from 'express';
import { AnalyticsController } from './Analytics.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { lenientLimiter } from '../../middleware';

export class AnalyticsRoutes {
  private router: Router;
  private controller: AnalyticsController;

  constructor() {
    this.router = Router();
    this.controller = new AnalyticsController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All analytics routes require authentication
    this.router.use(authenticate);

    // Get request statistics
    // Use lenient limiter since analytics endpoints are frequently accessed (dashboards, charts, etc.)
    this.router.get('/statistics', lenientLimiter, this.controller.getRequestStatistics);

    // Get current month category chart (bar chart)
    this.router.get('/charts/category', lenientLimiter, this.controller.getCurrentMonthCategoryChart);

    // Get current month status chart
    this.router.get('/charts/status', lenientLimiter, this.controller.getCurrentMonthStatusChart);

    // Get current month daily chart
    this.router.get('/charts/daily', lenientLimiter, this.controller.getCurrentMonthDailyChart);

    // Get complete analytics summary
    this.router.get('/summary', lenientLimiter, this.controller.getAnalyticsSummary);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new AnalyticsRoutes().getRouter();

