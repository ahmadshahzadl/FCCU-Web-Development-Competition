import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { socketService } from '@/services/socket';
import type { ServiceRequest, RequestStatus } from '@/types';

export const useRequests = (filters?: {
  status?: RequestStatus;
  category?: string;
  studentId?: string;
}) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  useEffect(() => {
    // Listen for real-time updates
    const handleStatusUpdate = (data: { requestId: string; status: string }) => {
      setRequests((prev) =>
        prev.map((req) =>
          req._id === data.requestId ? { ...req, status: data.status as RequestStatus } : req
        )
      );
    };

    socketService.onRequestStatusUpdate(handleStatusUpdate);

    return () => {
      socketService.offRequestStatusUpdate(handleStatusUpdate);
    };
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await apiService.getRequests(filters);
      const requestsArray = Array.isArray(data) ? data : (data as any).data || [];
      setRequests(requestsArray);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    loading,
    refetch: fetchRequests,
  };
};

