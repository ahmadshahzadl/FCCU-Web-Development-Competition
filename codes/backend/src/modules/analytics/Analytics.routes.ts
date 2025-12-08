import { Router } from 'express';
import { AnalyticsController } from './Analytics.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

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
    this.router.get('/statistics', this.controller.getRequestStatistics);

    // Get current month category chart (bar chart)
    this.router.get('/charts/category', this.controller.getCurrentMonthCategoryChart);

    // Get current month status chart
    this.router.get('/charts/status', this.controller.getCurrentMonthStatusChart);

    // Get current month daily chart
    this.router.get('/charts/daily', this.controller.getCurrentMonthDailyChart);

    // Get complete analytics summary
    this.router.get('/summary', this.controller.getAnalyticsSummary);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Export singleton instance
export default new AnalyticsRoutes().getRouter();

