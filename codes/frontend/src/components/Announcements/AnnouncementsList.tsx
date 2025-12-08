import type { Announcement } from '@/types';
import AnnouncementCard from './AnnouncementCard';
import AnnouncementsEmptyState from './AnnouncementsEmptyState';

interface AnnouncementsListProps {
  announcements: Announcement[];
  showUnreadOnly: boolean;
  currentUserId?: string;
  isAdminOrManager: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnnouncementsList = ({
  announcements,
  showUnreadOnly,
  currentUserId,
  isAdminOrManager,
  onMarkAsRead,
  onDelete,
}: AnnouncementsListProps) => {
  if (announcements.length === 0) {
    return <AnnouncementsEmptyState showUnreadOnly={showUnreadOnly} />;
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => {
        const isRead = announcement.readBy?.includes(currentUserId || '');
        return (
          <AnnouncementCard
            key={announcement._id}
            announcement={announcement}
            isRead={isRead}
            isAdminOrManager={isAdminOrManager}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default AnnouncementsList;

