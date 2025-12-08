import { Bell } from 'lucide-react';

interface AnnouncementsEmptyStateProps {
  showUnreadOnly: boolean;
}

const AnnouncementsEmptyState = ({ showUnreadOnly }: AnnouncementsEmptyStateProps) => {
  return (
    <div className="card text-center py-16">
      <div className="flex flex-col items-center">
        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <Bell className="h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
          {showUnreadOnly ? 'No unread announcements' : 'No announcements found'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
          {showUnreadOnly
            ? 'All caught up! Check back later for new updates.'
            : 'There are no announcements to display at this time.'}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementsEmptyState;

