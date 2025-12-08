import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import type { ServiceRequest } from '@/types';
import { useSocket } from '@/hooks/useSocket';
import { useStudentSocket } from '@/hooks/useStudentSocket';
import { storage } from '@/utils/storage';
import RequestHistoryHeader from '@/components/RequestHistory/RequestHistoryHeader';
import RequestHistoryCard from '@/components/RequestHistory/RequestHistoryCard';
import EmptyState from '@/components/RequestHistory/EmptyState';

const RequestHistory = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const socket = useSocket();

  // Use global student socket hook for toasts (shows on all pages)
  useStudentSocket();

  // Handle request update event (only for UI updates, no toasts here)
  const handleRequestUpdate = useCallback(
    (payload: { request: ServiceRequest; updatedBy?: string }) => {
      const { request } = payload;

      // Only process if it's the current student's request
      if (!user?.id || request.studentId !== user.id) {
        return;
      }

      // Show visual feedback only (toasts are handled by useStudentSocket)
      setUpdatingRequestId(request._id);
      setTimeout(() => setUpdatingRequestId(null), 2000);

      // Update the request in the list
      setRequests((prev) => prev.map((req) => (req._id === request._id ? request : req)));
    },
    [user?.id]
  );

  useEffect(() => {
    if (user?.id) {
      fetchUserRequests();
      loadCategories();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !socket || user.role !== 'student') return;

    // Ensure socket is connected
    if (!socket.isConnected()) {
      const token = storage.getToken();
      if (token) {
        socket.connect(token);
      }
    }

    // Student: Listen for updates to own requests (for UI updates only)
    socket.onUserRequestUpdated(handleRequestUpdate);

    // Student: Listen for confirmation when they create a request
    const handleRequestCreated = (payload: { request: ServiceRequest }) => {
      const { request } = payload;

      // Only show if it's the current student's request
      const isOwnRequest =
        request.studentId === user.id ||
        request.studentId === (user as any)._id ||
        !request.studentId; // If no studentId, assume it's for current user (just created)

      if (isOwnRequest) {
        toast.success('Request submitted successfully!', {
          duration: 3000,
          position: 'top-right',
          icon: '✅',
        });

        // Add to list
        setRequests((prev) => {
          if (prev.some((r) => r._id === request._id)) {
            return prev;
          }
          return [request, ...prev];
        });
      }
    };

    socket.onRequestCreated(handleRequestCreated);

    return () => {
      // Cleanup socket listeners on unmount
      socket.offUserRequestUpdated(handleRequestUpdate);
      socket.offRequestCreated(handleRequestCreated);
    };
  }, [user?.id, user?.role, socket, handleRequestUpdate]);

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories(false);
      setCategories(response);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const getCategoryName = (slug: string) => {
    return categories.find((c) => c.slug === slug)?.name || slug;
  };

  const fetchUserRequests = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = await apiService.getUserRequests(user.id);
      setRequests(data);
    } catch (error: any) {
      toast.error('Failed to fetch request history');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Loading request history...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <RequestHistoryHeader onRefresh={fetchUserRequests} loading={loading} />

      <div className="space-y-4">
        {requests.length === 0 ? (
          <EmptyState />
        ) : (
          requests.map((request) => (
            <RequestHistoryCard
              key={request._id}
              request={request}
              categoryName={getCategoryName(request.category)}
              isUpdating={updatingRequestId === request._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RequestHistory;
