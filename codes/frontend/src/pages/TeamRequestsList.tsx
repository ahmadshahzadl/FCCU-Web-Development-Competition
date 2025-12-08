import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { socketService } from '@/services/socket';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { RefreshCw, Eye, Edit, Trash2, Filter } from 'lucide-react';
import type { ServiceRequest, RequestStatus, Category } from '@/types';
import { useSocket } from '@/hooks/useSocket';
import RequestFilters from '@/components/RequestManagement/RequestFilters';
import RequestTable from '@/components/RequestManagement/RequestTable';
import RequestDetailsModal from '@/components/RequestManagement/RequestDetailsModal';
import UpdateRequestStatusModal from '@/components/RequestManagement/UpdateRequestStatusModal';
import DeleteConfirmationModal from '@/components/RequestManagement/DeleteConfirmationModal';

const TeamRequestsList = () => {
  const { user } = useAuth();
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

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadRequests();
  }, [filters]);

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
  }, [selectedRequest, viewingRequestId, socket]);

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

  const handleRequestCreated = useCallback((payload: { request: ServiceRequest }) => {
    // Only add if it matches current filters
    const matchesFilters =
      (!filters.status || payload.request.status === filters.status) &&
      (!filters.category || payload.request.category === filters.category);

    if (matchesFilters) {
      setRequests((prev) => [payload.request, ...prev]);
      toast.success(`New request: ${payload.request.description.substring(0, 50)}...`);
    }
  }, [filters.status, filters.category]);

  const handleRequestUpdated = useCallback((payload: { request: ServiceRequest; updatedBy?: string }) => {
    setRequests((prev) =>
      prev.map((req) => (req._id === payload.request._id ? payload.request : req))
    );
  }, []);

  const handleRequestDeleted = useCallback((payload: { requestId: string; deletedBy?: string }) => {
    setRequests((prev) => prev.filter((req) => req._id !== payload.requestId));
    setSelectedRequest((prev) => {
      if (prev?._id === payload.requestId) {
        setViewingRequestId(null);
        return null;
      }
      return prev;
    });
  }, []);

  const handleRequestResolved = useCallback((payload: {
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
        toast.warning('This request has been resolved!', {
          duration: 5000,
        });
        return payload.request;
      }
      return prev;
    });
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (!socket) return;
    
    // Listen for new requests
    socket.onRequestCreated(handleRequestCreated);

    // Listen for request updates
    socket.onRequestUpdated(handleRequestUpdated);

    // Listen for request deletions
    socket.onRequestDeleted(handleRequestDeleted);

    return () => {
      // Cleanup socket listeners
      socket.offRequestCreated(handleRequestCreated);
      socket.offRequestUpdated(handleRequestUpdated);
      socket.offRequestDeleted(handleRequestDeleted);
    };
  }, [socket, handleRequestCreated, handleRequestUpdated, handleRequestDeleted]);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Requests Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
            View and manage service requests
          </p>
        </div>
        <button
          onClick={loadRequests}
          className="btn btn-secondary flex items-center space-x-2 text-sm px-3 py-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

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

