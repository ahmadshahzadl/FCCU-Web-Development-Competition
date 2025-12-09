/**
 * Statistics Cards Component
 * 
 * Displays request statistics in card format
 */

import { FileText, Clock, AlertCircle, CheckCircle2, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import type { RequestStatistics } from '@/types';

interface StatisticsCardsProps {
  statistics: RequestStatistics;
}

const StatisticsCards = ({ statistics }: StatisticsCardsProps) => {
  // Ensure statistics and status exist
  if (!statistics || !statistics.status) {
    return null;
  }

  const cards = [
    {
      title: 'Total Requests',
      value: statistics.status.total || 0,
      color: 'bg-blue-500',
      icon: FileText,
      bgGradient: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800/50',
      textColor: 'text-blue-600 dark:text-blue-400',
      valueColor: 'text-blue-900 dark:text-blue-100',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    },
    {
      title: 'Pending',
      value: statistics.status.pending || 0,
      color: 'bg-yellow-500',
      icon: Clock,
      bgGradient: 'from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800/50',
      textColor: 'text-amber-600 dark:text-amber-400',
      valueColor: 'text-amber-900 dark:text-amber-100',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    },
    {
      title: 'In Progress',
      value: statistics.status.inProgress || 0,
      color: 'bg-blue-500',
      icon: AlertCircle,
      bgGradient: 'from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-700/60',
      textColor: 'text-blue-600 dark:text-blue-300',
      valueColor: 'text-blue-900 dark:text-blue-50',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/30',
    },
    {
      title: 'Resolved',
      value: statistics.status.resolved || 0,
      color: 'bg-green-500',
      icon: CheckCircle2,
      bgGradient: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800/50',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-900 dark:text-emerald-100',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    },
    {
      title: 'Today',
      value: statistics.timeRange?.today || 0,
      color: 'bg-purple-500',
      icon: Calendar,
      bgGradient: 'from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800/50',
      textColor: 'text-purple-600 dark:text-purple-400',
      valueColor: 'text-purple-900 dark:text-purple-100',
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    },
    {
      title: 'This Week',
      value: statistics.timeRange?.thisWeek || 0,
      color: 'bg-indigo-500',
      icon: CalendarDays,
      bgGradient: 'from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800/50',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      valueColor: 'text-indigo-900 dark:text-indigo-100',
      iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    },
    {
      title: 'This Month',
      value: statistics.timeRange?.thisMonth || 0,
      color: 'bg-pink-500',
      icon: CalendarRange,
      bgGradient: 'from-pink-50 to-pink-100/50 dark:from-pink-950/30 dark:to-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800/50',
      textColor: 'text-pink-600 dark:text-pink-400',
      valueColor: 'text-pink-900 dark:text-pink-100',
      iconBg: 'bg-pink-500/10 dark:bg-pink-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 transition-colors duration-300">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`card bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} p-3 sm:p-4 transition-colors duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className={`text-xs sm:text-sm font-medium ${card.textColor} mb-1 truncate transition-colors duration-300`}>
                  {card.title}
                </p>
                <p className={`text-lg sm:text-xl md:text-2xl font-bold ${card.valueColor} transition-colors duration-300`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg ${card.iconBg} flex-shrink-0 ml-2 transition-colors duration-300`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${card.textColor} transition-colors duration-300`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;

