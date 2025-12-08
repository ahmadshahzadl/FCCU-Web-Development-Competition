import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useAnnouncements } from '@/contexts/AnnouncementContext';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'react-hot-toast';
import type { Announcement, AnnouncementType } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';
import CreateAnnouncementModal from '@/components/Announcements/CreateAnnouncementModal';
import AnnouncementsHeader from '@/components/Announcements/AnnouncementsHeader';
import AnnouncementsFilters from '@/components/Announcements/AnnouncementsFilters';
import AnnouncementsList from '@/components/Announcements/AnnouncementsList';
import AnnouncementsLoading from '@/components/Announcements/AnnouncementsLoading';

const Announcements = () => {
  const { user } = useAuth();
  const { unreadCount, markAsRead, markAllAsRead, refreshUnreadCount } = useAnnouncements();
  const socket = useSocket();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [filter, setFilter] = useState<AnnouncementType | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  usePageTitle('Announcements');

  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const response = showUnreadOnly
        ? await apiService.getUnreadAnnouncements()
        : await apiService.getUserAnnouncements();
      setAnnouncements(response);
    } catch (error: any) {
      toast.error('Failed to load announcements');
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  }, [showUnreadOnly]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  // Setup socket listeners for real-time updates
  useEffect(() => {
    if (!socket || !user) return;

    const handleAnnouncementCreated = (payload: { announcement: Announcement }) => {
      const { announcement } = payload;

      // Check if announcement is for current user
      const isForUser =
        announcement.target === 'all' ||
        (announcement.target === 'roles' &&
          announcement.targetRoles?.includes(user.role)) ||
        (announcement.target === 'users' &&
          announcement.targetUserIds?.includes(user.id || ''));

      if (isForUser) {
        // Add to list if not already present
        setAnnouncements((prev) => {
          if (prev.some((a) => a._id === announcement._id)) {
            return prev;
          }
          return [announcement, ...prev];
        });

        // Refresh unread count (context will handle the update)
        refreshUnreadCount();

        // Show toast notification
        toast(`📢 ${announcement.title}`, {
          duration: 5000,
          position: 'top-right',
          icon: '📢',
        });
      }
    };

    const handleAnnouncementDeleted = (payload: { announcementId: string }) => {
      setAnnouncements((prev) => {
        const deleted = prev.find((a) => a._id === payload.announcementId);
        // Refresh unread count if announcement was unread
        if (deleted && !deleted.readBy?.includes(user?.id || '')) {
          refreshUnreadCount();
        }
        return prev.filter((a) => a._id !== payload.announcementId);
      });
    };

    socket.onAnnouncementCreated(handleAnnouncementCreated);
    socket.onAnnouncementDeleted(handleAnnouncementDeleted);

    return () => {
      socket.offAnnouncementCreated(handleAnnouncementCreated);
      socket.offAnnouncementDeleted(handleAnnouncementDeleted);
    };
  }, [socket, user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      // Use context method which will update the count
      await markAsRead(id);
      setAnnouncements((prev) =>
        prev.map((a) =>
          a._id === id
            ? { ...a, readBy: [...(a.readBy || []), user?.id || ''] }
            : a
        )
      );
    } catch (error: any) {
      toast.error('Failed to mark as read');
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Use context method which will update the count
      await markAllAsRead();
      setAnnouncements((prev) =>
        prev.map((a) => ({
          ...a,
          readBy: [...(a.readBy || []), user?.id || ''],
        }))
      );
      toast.success('All announcements marked as read', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error: any) {
      toast.error('Failed to mark all as read');
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await apiService.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      toast.success('Announcement deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete announcement');
      console.error('Error deleting announcement:', error);
    }
  };

  const filteredAnnouncements =
    filter === 'all'
      ? announcements
      : announcements.filter((ann) => ann.type === filter);

  if (loading) {
    return <AnnouncementsLoading />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:px-6 lg:px-8">
      {/* Header */}
      <AnnouncementsHeader
        unreadCount={unreadCount}
        isAdminOrManager={isAdminOrManager}
        onCreateClick={() => setShowCreateModal(true)}
        onRefresh={loadAnnouncements}
      />

      {/* Filters */}
      <AnnouncementsFilters
        filter={filter}
        showUnreadOnly={showUnreadOnly}
        unreadCount={unreadCount}
        onFilterChange={setFilter}
        onToggleUnreadOnly={() => setShowUnreadOnly(!showUnreadOnly)}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Announcements List */}
      <AnnouncementsList
        announcements={filteredAnnouncements}
        showUnreadOnly={showUnreadOnly}
        currentUserId={user?.id}
        isAdminOrManager={isAdminOrManager}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <CreateAnnouncementModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadAnnouncements();
            refreshUnreadCount();
          }}
        />
      )}
    </div>
  );
};

export default Announcements;
