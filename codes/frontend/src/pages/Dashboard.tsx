/**
 * Dashboard Page
 * 
 * Analytics dashboard for admin and manager roles
 * Features: Statistics, charts, and quick actions
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { RefreshCw, Users, FileText, Settings, Filter } from 'lucide-react';
import type { AnalyticsSummary } from '@/types';
import StatisticsCards from '@/components/Analytics/StatisticsCards';
import CategoryChart from '@/components/Analytics/CategoryChart';
import StatusChart from '@/components/Analytics/StatusChart';
import DailyChart from '@/components/Analytics/DailyChart';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAnalyticsSummary();
      setSummary(response);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load analytics';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Quick Actions
  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users and roles',
      icon: Users,
      path: '/user-management',
      color: 'bg-blue-500',
      bgGradient: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800/50',
      textColor: 'text-blue-600 dark:text-blue-400',
      availableFor: ['admin', 'manager'] as ('admin' | 'manager')[],
    },
    {
      title: 'Request Management',
      description: 'View and manage requests',
      icon: FileText,
      path: '/request-management',
      color: 'bg-green-500',
      bgGradient: 'from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800/50',
      textColor: 'text-green-600 dark:text-green-400',
      availableFor: ['admin', 'manager'] as ('admin' | 'manager')[],
    },
    {
      title: 'Category Management',
      description: 'Manage request categories',
      icon: Filter,
      path: '/category-management',
      color: 'bg-purple-500',
      bgGradient: 'from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800/50',
      textColor: 'text-purple-600 dark:text-purple-400',
      availableFor: ['admin', 'manager'] as ('admin' | 'manager')[],
    },
    {
      title: 'System Config',
      description: 'Configure system settings',
      icon: Settings,
      path: '/system-config',
      color: 'bg-orange-500',
      bgGradient: 'from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800/50',
      textColor: 'text-orange-600 dark:text-orange-400',
      availableFor: ['admin'] as ('admin')[],
    },
  ].filter((action) => user && (action.availableFor as string[]).includes(user.role));

  if (loading) {
    return (
      <div className="w-full space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 transition-colors duration-300">
        <div className="card">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto"></div>
              <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 transition-colors duration-300">
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
          <div className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-red-800 dark:text-red-400">{error}</p>
            <button
              onClick={loadAnalytics}
              className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 touch-manipulation"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!summary || !summary.statistics || !summary.statistics.status) {
    return (
      <div className="w-full space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 transition-colors duration-300">
        <div className="card">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No analytics data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const resolutionRate =
    summary.statistics.status.total > 0
      ? ((summary.statistics.status.resolved / summary.statistics.status.total) * 100).toFixed(1)
      : '0';

  return (
    <div className="w-full space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
            Comprehensive analytics and insights
          </p>
        </div>
        <button
          onClick={loadAnalytics}
          className="btn btn-secondary flex items-center justify-center space-x-2 text-xs sm:text-sm px-3 py-2 w-full sm:w-auto min-w-0"
        >
          <RefreshCw className="h-4 w-4 flex-shrink-0" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="card p-3 sm:p-4 md:p-6 transition-colors duration-300">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors duration-300">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`card bg-gradient-to-br ${action.bgGradient} border ${action.borderColor} p-4 hover:shadow-lg transition-all duration-200 text-left touch-manipulation`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 sm:p-3 rounded-lg ${action.color} bg-opacity-10 dark:bg-opacity-20 flex-shrink-0`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${action.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm sm:text-base font-semibold ${action.textColor} mb-1 transition-colors duration-300`}>
                      {action.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards statistics={summary.statistics} />

      {/* Resolution Rate */}
      <div className="card p-3 sm:p-4 md:p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Resolution Rate
          </span>
          <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {resolutionRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5 transition-colors duration-300">
          <div
            className="bg-green-600 dark:bg-green-500 h-2 sm:h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${resolutionRate}%` }}
          />
        </div>
      </div>

      {/* Charts Grid */}
      {summary.charts && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 transition-colors duration-300">
            {/* Category Chart */}
            {summary.charts.categoryChart && (
              <div className="card p-3 sm:p-4 md:p-6 transition-colors duration-300">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors duration-300">
                  Requests by Category - {summary.charts.categoryChart.month}
                </h2>
                <CategoryChart data={summary.charts.categoryChart} />
              </div>
            )}

            {/* Status Chart */}
            {summary.charts.statusChart && (
              <div className="card p-3 sm:p-4 md:p-6 transition-colors duration-300">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors duration-300">
                  Requests by Status - {summary.charts.statusChart.month}
                </h2>
                <StatusChart data={summary.charts.statusChart} />
              </div>
            )}
          </div>

          {/* Daily Chart */}
          {summary.charts.dailyChart && (
            <div className="card p-3 sm:p-4 md:p-6 transition-colors duration-300">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors duration-300">
                Daily Request Trends - {summary.charts.dailyChart.month}
              </h2>
              <DailyChart data={summary.charts.dailyChart} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
