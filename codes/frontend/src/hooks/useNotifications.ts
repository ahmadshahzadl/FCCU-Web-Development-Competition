import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { socketService } from '@/services/socket';
import { toast } from 'react-hot-toast';
import type { Notification } from '@/types';

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }

    // Listen for new notifications
    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.success(`${notification.title}: ${notification.message}`);
    };

    socketService.onNewNotification(handleNewNotification);

    return () => {
      socketService.offNewNotification(handleNewNotification);
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const data = await apiService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      const notification = notifications.find((n) => n._id === id);
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications,
  };
};

