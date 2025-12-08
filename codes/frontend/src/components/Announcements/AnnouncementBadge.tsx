import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAnnouncements } from '@/contexts/AnnouncementContext';
import { Bell } from 'lucide-react';

const AnnouncementBadge = () => {
  const { user } = useAuth();
  const { unreadCount } = useAnnouncements();

  if (!user || unreadCount === 0) {
    return null;
  }

  return (
    <Link
      to="/announcements"
      className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
      aria-label={`${unreadCount} unread announcements`}
    >
      <Bell className="h-5 w-5" />
      <span className="absolute top-0 right-0 block h-5 w-5 bg-red-600 dark:bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    </Link>
  );
};

export default AnnouncementBadge;

