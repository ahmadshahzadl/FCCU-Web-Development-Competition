import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Category } from '@/types';

interface RequestAnalyticsProps {
  categories: Category[];
}

const RequestAnalytics = ({ categories }: RequestAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<{
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    byCategory: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [categories]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch all counts in parallel
      const [total, pending, inProgress, resolved, ...categoryCounts] =
        await Promise.all([
          apiService.getRequestCount(),
          apiService.getRequestCount({ status: 'pending' }),
          apiService.getRequestCount({ status: 'in-progress' }),
          apiService.getRequestCount({ status: 'resolved' }),
          ...categories.map((cat) =>
            apiService.getRequestCount({ category: cat.slug })
          ),
        ]);

      // Build category counts object
      const byCategory: Record<string, number> = {};
      categories.forEach((cat, index) => {
        byCategory[cat.slug] = categoryCounts[index]?.total || 0;
      });

      setAnalytics({
        total: total.total,
        pending: pending.total,
        inProgress: inProgress.total,
        resolved: resolved.total,
        byCategory,
      });
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-3 sm:p-4 md:p-6">
        <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const resolutionRate =
    analytics.total > 0
      ? ((analytics.resolved / analytics.total) * 100).toFixed(1)
      : '0';

  return (
    <div className="card p-3 sm:p-4 md:p-6 transition-colors duration-300">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors duration-300">
        Request Analytics
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <div className="bg-gray-50 dark:bg-gray-800/30 p-2.5 sm:p-3 md:p-4 rounded-lg transition-colors duration-300">
          <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300 truncate">
            Total
          </h4>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {analytics.total}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2.5 sm:p-3 md:p-4 rounded-lg transition-colors duration-300">
          <h4 className="text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1 transition-colors duration-300 truncate">
            Pending
          </h4>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-900 dark:text-yellow-300 transition-colors duration-300">
            {analytics.pending}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 sm:p-3 md:p-4 rounded-lg transition-colors duration-300">
          <h4 className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400 mb-1 transition-colors duration-300 truncate">
            In Progress
          </h4>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 transition-colors duration-300">
            {analytics.inProgress}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-2.5 sm:p-3 md:p-4 rounded-lg transition-colors duration-300">
          <h4 className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400 mb-1 transition-colors duration-300 truncate">
            Resolved
          </h4>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-900 dark:text-green-300 transition-colors duration-300">
            {analytics.resolved}
          </p>
        </div>
      </div>

      {/* Resolution Rate */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Resolution Rate
          </span>
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {resolutionRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors duration-300">
          <div
            className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${resolutionRate}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">
            By Category
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg transition-colors duration-300"
              >
                <p className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400 transition-colors duration-300">
                  {analytics.byCategory[category.slug] || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 truncate">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestAnalytics;

