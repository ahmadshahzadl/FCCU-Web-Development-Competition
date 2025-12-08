import { Filter, CheckCheck } from 'lucide-react';
import type { AnnouncementType } from '@/types';

interface AnnouncementsFiltersProps {
  filter: AnnouncementType | 'all';
  showUnreadOnly: boolean;
  unreadCount: number;
  onFilterChange: (filter: AnnouncementType | 'all') => void;
  onToggleUnreadOnly: () => void;
  onMarkAllAsRead: () => void;
}

const AnnouncementsFilters = ({
  filter,
  showUnreadOnly,
  unreadCount,
  onFilterChange,
  onToggleUnreadOnly,
  onMarkAllAsRead,
}: AnnouncementsFiltersProps) => {
  const filterButtons = [
    { value: 'all' as const, label: 'All', color: 'primary' },
    { value: 'notice' as const, label: '📢 Notices', color: 'blue' },
    { value: 'event' as const, label: '📅 Events', color: 'green' },
    { value: 'cancellation' as const, label: '❌ Cancellations', color: 'red' },
    { value: 'request-update' as const, label: '📝 Request Updates', color: 'purple' },
  ];

  const getFilterButtonClasses = (value: AnnouncementType | 'all', color: string) => {
    const isActive = filter === value;
    const colorClasses = {
      primary: isActive ? 'bg-primary-600 dark:bg-primary-500' : '',
      blue: isActive ? 'bg-blue-600 dark:bg-blue-500' : '',
      green: isActive ? 'bg-green-600 dark:bg-green-500' : '',
      red: isActive ? 'bg-red-600 dark:bg-red-500' : '',
      purple: isActive ? 'bg-purple-600 dark:bg-purple-500' : '',
    };

    return `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
      isActive
        ? `${colorClasses[color as keyof typeof colorClasses]} text-white shadow-sm`
        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
    }`;
  };

  return (
    <div className="card mb-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-colors duration-300" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Type:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {filterButtons.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => onFilterChange(value)}
                className={getFilterButtonClasses(value, color)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onToggleUnreadOnly}
            className={`btn text-sm ${showUnreadOnly ? 'btn-primary' : 'btn-secondary'}`}
          >
            {showUnreadOnly ? 'Show All' : 'Show Unread Only'}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="btn btn-secondary flex items-center space-x-2 text-sm"
            >
              <CheckCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Mark All as Read</span>
              <span className="sm:hidden">Mark All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsFilters;

