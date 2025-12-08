import { Request } from '../request/Request.model';
import { Category } from '../category/Category.model';

export class AnalyticsService {
  // Get overall request statistics
  async getRequestStatistics() {
    // Get total counts by status
    const pendingCount = await Request.countDocuments({
      status: 'pending',
      deletedAt: { $exists: false },
    });

    const inProgressCount = await Request.countDocuments({
      status: 'in-progress',
      deletedAt: { $exists: false },
    });

    const resolvedCount = await Request.countDocuments({
      status: 'resolved',
      deletedAt: { $exists: false },
    });

    const totalRequests = pendingCount + inProgressCount + resolvedCount;

    // Get all active categories from database
    const allCategories = await Category.find({ isActive: true })
      .select('slug name')
      .lean();

    // Get counts by category using aggregation
    const categoryCounts = await Request.aggregate([
      {
        $match: {
          deletedAt: { $exists: false },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Create a map for quick lookup
    const categoryMap = new Map(categoryCounts.map((item) => [item._id, item.count]));

    // Build category statistics object with all categories from DB
    const categoryStatsObject: Record<string, number> = {};
    allCategories.forEach((cat) => {
      categoryStatsObject[cat.slug] = categoryMap.get(cat.slug) || 0;
    });

    // Also get sorted category breakdown for response
    const categoryBreakdown = allCategories.map((cat) => ({
      category: cat.slug,
      categoryName: cat.name,
      count: categoryMap.get(cat.slug) || 0,
    })).sort((a, b) => b.count - a.count);

    // Get requests created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestsToday = await Request.countDocuments({
      createdAt: { $gte: today },
      deletedAt: { $exists: false },
    });

    // Get requests created this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const requestsThisWeek = await Request.countDocuments({
      createdAt: { $gte: weekAgo },
      deletedAt: { $exists: false },
    });

    // Get requests created this month
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const requestsThisMonth = await Request.countDocuments({
      createdAt: { $gte: monthAgo },
      deletedAt: { $exists: false },
    });

    return {
      status: {
        pending: pendingCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        total: totalRequests,
      },
      category: categoryStatsObject,
      timeRange: {
        today: requestsToday,
        thisWeek: requestsThisWeek,
        thisMonth: requestsThisMonth,
      },
      categoryBreakdown: categoryBreakdown,
    };
  }

  // Get current month requests by category (for bar chart)
  async getCurrentMonthCategoryChart() {
    // Get start and end of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Get all active categories from database
    const allCategories = await Category.find({ isActive: true })
      .select('slug name')
      .lean();

    // Aggregate requests by category for current month
    const categoryData = await Request.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          deletedAt: { $exists: false },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Create a map for quick lookup
    const categoryMap = new Map(categoryData.map((item) => [item._id, item.count]));

    // Build chart data ensuring all categories are included (even if count is 0)
    const chartData = allCategories.map((cat) => ({
      category: cat.slug,
      categoryName: cat.name,
      count: categoryMap.get(cat.slug) || 0,
    }));

    return {
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      data: chartData,
      total: chartData.reduce((sum, item) => sum + item.count, 0),
    };
  }

  // Get requests by status for current month
  async getCurrentMonthStatusChart() {
    // Get start and end of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Aggregate requests by status for current month
    const statusData = await Request.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          deletedAt: { $exists: false },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Ensure all statuses are included (even if count is 0)
    const allStatuses = ['pending', 'in-progress', 'resolved'];
    const statusMap = new Map(statusData.map((item) => [item._id, item.count]));

    const chartData = allStatuses.map((status) => ({
      status: status,
      count: statusMap.get(status) || 0,
    }));

    return {
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      data: chartData,
      total: chartData.reduce((sum, item) => sum + item.count, 0),
    };
  }

  // Get daily requests for current month (line chart data)
  async getCurrentMonthDailyChart() {
    // Get start and end of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Get requests grouped by day
    const dailyData = await Request.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          deletedAt: { $exists: false },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return {
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      data: dailyData.map((item) => ({
        date: item._id,
        count: item.count,
      })),
      total: dailyData.reduce((sum, item) => sum + item.count, 0),
    };
  }

  // Get overall analytics summary
  async getAnalyticsSummary() {
    const statistics = await this.getRequestStatistics();
    const categoryChart = await this.getCurrentMonthCategoryChart();
    const statusChart = await this.getCurrentMonthStatusChart();
    const dailyChart = await this.getCurrentMonthDailyChart();

    return {
      statistics,
      charts: {
        categoryChart,
        statusChart,
        dailyChart,
      },
    };
  }
}

