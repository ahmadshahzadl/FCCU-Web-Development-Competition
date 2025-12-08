import { Bell, Plus, RefreshCw, AlertCircle } from 'lucide-react';

interface AnnouncementsHeaderProps {
  unreadCount: number;
  isAdminOrManager: boolean;
  onCreateClick: () => void;
  onRefresh: () => void;
}

const AnnouncementsHeader = ({
  unreadCount,
  isAdminOrManager,
  onCreateClick,
  onRefresh,
}: AnnouncementsHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 transition-colors duration-300">
            <Bell className="h-7 w-7 text-primary-600 dark:text-primary-400 transition-colors duration-300" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Announcements
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
              Stay updated with the latest news and updates
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {isAdminOrManager && (
            <button
              onClick={onCreateClick}
              className="btn btn-primary flex items-center space-x-2 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Plus className="h-4 w-4" />
              <span>Create Announcement</span>
            </button>
          )}
          <button
            onClick={onRefresh}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
      {unreadCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg inline-flex">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <span className="text-sm font-semibold text-red-700 dark:text-red-300">
            {unreadCount} unread announcement{unreadCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsHeader;

