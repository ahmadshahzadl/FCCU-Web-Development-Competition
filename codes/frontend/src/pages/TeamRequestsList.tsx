import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { ServiceRequest, RequestStatus, Category } from '@/types';
import { useSocket } from '@/hooks/useSocket';
import { useTeamSocket } from '@/hooks/useTeamSocket';
import TeamRequestsHeader from '@/components/TeamRequests/TeamRequestsHeader';
import RequestFilters from '@/components/RequestManagement/RequestFilters';
import RequestTable from '@/components/RequestManagement/RequestTable';
import RequestDetailsModal from '@/components/RequestManagement/RequestDetailsModal';
import UpdateRequestStatusModal from '@/components/RequestManagement/UpdateRequestStatusModal';
import DeleteConfirmationModal from '@/components/RequestManagement/DeleteConfirmationModal';

const TeamRequestsList = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  
  const [filters, setFilters] = useState<{
    status: '' | RequestStatus;
    category: string;
    page: number;
    limit: number;
  }>({
    status: '',
    category: '',
    page: 1,
    limit: 20,
  });

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; description: string } | null>(null);
  const [viewingRequestId, setViewingRequestId] = useState<string | null>(null);
  
  const socket = useSocket();
  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);

  // Keep refs in sync with state
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadRequests();
  }, [filters]);

  // Define handleRequestResolved before it's used in useEffect
  const handleRequestResolved = useCallback(
    (payload: {
      request: ServiceRequest;
      oldStatus: string;
      newStatus: 'resolved';
      updatedBy?: string;
    }) => {
      setRequests((prev) =>
        prev.map((req) => (req._id === payload.request._id ? payload.request : req))
      );

      setSelectedRequest((prev) => {
        if (prev?._id === payload.request._id) {
          toast('This request has been resolved!', {
            duration: 5000,
            icon: '⚠️',
          });
          return payload.request;
        }
        return prev;
      });
    },
    []
  );

  // Use team socket hook for connection and event handling
  const { connected } = useTeamSocket({
    filtersRef,
    paginationRef,
    setRequests,
    setPagination,
  });

  useEffect(() => {
    if (!socket) return;
    
    // Join/leave request room when viewing a request
    if (viewingRequestId && selectedRequest) {
      socket.joinRequestRoom(viewingRequestId);
      socket.onRequestResolved(handleRequestResolved);
      
      return () => {
        socket.leaveRequestRoom(viewingRequestId);
        socket.offRequestResolved(handleRequestResolved);
      };
    } else if (viewingRequestId && !selectedRequest) {
      socket.leaveRequestRoom(viewingRequestId);
      socket.offRequestResolved(handleRequestResolved);
      setViewingRequestId(null);
    }
  }, [selectedRequest, viewingRequestId, socket, handleRequestResolved]);

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories(false); // Only active
      setCategories(response);
    } catch (error: any) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: filters.page,
        limit: filters.limit,
      };
      
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;

      const response = await apiService.getRequests(params);
      
      // Handle both array and paginated response
      if (Array.isArray(response)) {
        setRequests(response);
        setPagination(null);
      } else {
        setRequests(response.data);
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
        });
      }
    } catch (error: any) {
      toast.error('Failed to load requests');
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setViewingRequestId(request._id);
    setShowUpdateStatus(false);
  };

  const handleUpdate = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setViewingRequestId(request._id);
    setShowUpdateStatus(true);
  };

  const handleDelete = (requestId: string) => {
    const request = requests.find((r) => r._id === requestId);
    setDeleteConfirm({
      id: requestId,
      description: request?.description || 'this request',
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await apiService.deleteRequest(deleteConfirm.id);
      toast.success('Request deleted successfully');
      setDeleteConfirm(null);
      if (selectedRequest?._id === deleteConfirm.id) {
        setSelectedRequest(null);
        setViewingRequestId(null);
      }
      loadRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete request');
    }
  };

  const handleStatusUpdate = () => {
    setShowUpdateStatus(false);
    setSelectedRequest(null);
    setViewingRequestId(null);
    loadRequests();
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 px-2 md:px-0 transition-colors duration-300">
      {/* Header */}
      <TeamRequestsHeader connected={connected} onRefresh={loadRequests} />

      {/* Filters */}
      <RequestFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {/* Requests Table */}
      <RequestTable
        requests={requests}
        categories={categories}
        loading={loading}
        pagination={pagination}
        onView={handleView}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {/* Modals */}
      {selectedRequest && !showUpdateStatus && (
        <RequestDetailsModal
          request={selectedRequest}
          categories={categories}
          onClose={() => {
            setSelectedRequest(null);
            setViewingRequestId(null);
          }}
          onUpdate={() => {
            handleUpdate(selectedRequest);
          }}
          onDelete={() => {
            handleDelete(selectedRequest._id);
          }}
        />
      )}

      {showUpdateStatus && selectedRequest && (
        <UpdateRequestStatusModal
          requestId={selectedRequest._id}
          currentStatus={selectedRequest.status}
          currentNotes={selectedRequest.adminNotes}
          onSuccess={handleStatusUpdate}
          onCancel={() => {
            setShowUpdateStatus(false);
            setSelectedRequest(null);
            setViewingRequestId(null);
          }}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmationModal
          isOpen={!!deleteConfirm}
          requestDescription={deleteConfirm.description}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default TeamRequestsList;

