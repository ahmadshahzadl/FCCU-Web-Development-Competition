import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import type { Announcement } from '@/types';

interface AnnouncementContextType {
  unreadCount: number;
  loading: boolean;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

interface AnnouncementProviderProps {
  children: ReactNode;
}

export const AnnouncementProvider = ({ children }: AnnouncementProviderProps) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const count = await apiService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  // Listen for new announcements via socket
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
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.onAnnouncementCreated(handleAnnouncementCreated);

    return () => {
      socket.offAnnouncementCreated(handleAnnouncementCreated);
    };
  }, [socket, user]);

  const refreshUnreadCount = useCallback(async () => {
    await loadUnreadCount();
  }, [loadUnreadCount]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await apiService.markAnnouncementAsRead(id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
      throw error;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await apiService.markAllAnnouncementsAsRead();
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      throw error;
    }
  }, []);

  return (
    <AnnouncementContext.Provider
      value={{
        unreadCount,
        loading,
        refreshUnreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = (): AnnouncementContextType => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within AnnouncementProvider');
  }
  return context;
};

