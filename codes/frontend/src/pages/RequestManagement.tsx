import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { RefreshCw, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import type { ServiceRequest, RequestStatus, Category } from '@/types';
import { useSocket } from '@/hooks/useSocket';
import { storage } from '@/utils/storage';
import RequestAnalytics from '@/components/RequestManagement/RequestAnalytics';
import RequestFilters from '@/components/RequestManagement/RequestFilters';
import RequestTable from '@/components/RequestManagement/RequestTable';
import RequestDetailsModal from '@/components/RequestManagement/RequestDetailsModal';
import UpdateRequestStatusModal from '@/components/RequestManagement/UpdateRequestStatusModal';
import DeleteConfirmationModal from '@/components/RequestManagement/DeleteConfirmationModal';

const RequestManagement = () => {
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
  const [connected, setConnected] = useState(false);

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

  // Check socket connection status
  useEffect(() => {
    const checkConnection = () => {
      setConnected(socket.isConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 2000);

    return () => clearInterval(interval);
  }, [socket]);

  // Setup socket listeners for real-time updates
  useEffect(() => {
    if (!socket || !user) {
      console.log('RequestManagement: Socket or user not available', { socket: !!socket, user: !!user });
      return;
    }

    // Only set up listeners for admin, manager, or team roles
    if (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'team') {
      console.log('RequestManagement: User role does not require socket listeners', user.role);
      return;
    }

    // Ensure socket is connected
    const ensureConnection = async () => {
      if (!socket.isConnected()) {
        console.log('RequestManagement: Socket not connected, attempting to connect...');
        const token = storage.getToken();
        if (token) {
          socket.connect(token);
          
          // Wait for connection with retries
          let attempts = 0;
          const maxAttempts = 10;
          const checkConnection = setInterval(() => {
            attempts++;
            if (socket.isConnected()) {
              console.log('✅ RequestManagement: Socket connected successfully after', attempts * 200, 'ms');
              clearInterval(checkConnection);
            } else if (attempts >= maxAttempts) {
              console.error('❌ RequestManagement: Socket connection timeout after', maxAttempts * 200, 'ms');
              clearInterval(checkConnection);
            }
          }, 200);
        } else {
          console.error('RequestManagement: No token available for socket connection');
        }
      } else {
        console.log('✅ RequestManagement: Socket already connected', socket.getSocketId());
      }
    };

    ensureConnection();

    const handleRequestCreated = (payload: { request: ServiceRequest }) => {
      const { request } = payload;
      const currentFilters = filtersRef.current;
      const currentPagination = paginationRef.current;

      console.log('✅ RequestManagement: New request created event received!', {
        requestId: request._id,
        description: request.description.substring(0, 50),
        status: request.status,
        category: request.category,
        currentFilters: currentFilters,
      });

      // Always show toast notification
      toast.success(
        `🆕 New request: ${request.description.substring(0, 50)}${request.description.length > 50 ? '...' : ''}`,
        {
          duration: 5000,
        }
      );

      // Check if request matches current filters
      const matchesFilters =
        (!currentFilters.status || request.status === currentFilters.status) &&
        (!currentFilters.category || request.category === currentFilters.category);

      // Only add to list if it matches filters and we're on page 1
      if (matchesFilters && currentFilters.page === 1) {
        setRequests((prev) => {
          // Prevent duplicates
          if (prev.some((r) => r._id === request._id)) {
            console.log('RequestManagement: Request already exists, skipping', request._id);
            return prev;
          }
          console.log('RequestManagement: Adding new request to list', request._id);
          return [request, ...prev];
        });

        // Update pagination total
        if (currentPagination) {
          setPagination((prev) =>
            prev ? { ...prev, total: prev.total + 1 } : null
          );
        }
      } else if (!matchesFilters) {
        console.log('RequestManagement: Request does not match filters', {
          requestStatus: request.status,
          requestCategory: request.category,
          filterStatus: currentFilters.status,
          filterCategory: currentFilters.category,
        });
        toast.info('New request received but doesn\'t match current filters. Clear filters to see it.', {
          duration: 4000,
        });
      } else {
        console.log('RequestManagement: Request matches filters but not on page 1', {
          currentPage: currentFilters.page,
        });
      }
    };

    const handleRequestUpdated = (payload: { request: ServiceRequest; updatedBy?: string }) => {
      const { request } = payload;
      console.log('RequestManagement: Request updated event received', request._id);

      setRequests((prev) =>
        prev.map((req) => (req._id === request._id ? request : req))
      );
    };

    const handleRequestDeleted = (payload: { requestId: string; deletedBy?: string }) => {
      const { requestId } = payload;
      console.log('RequestManagement: Request deleted event received', requestId);

      setRequests((prev) => prev.filter((req) => req._id !== requestId));

      setPagination((currentPagination) => {
        // Update pagination total
        if (currentPagination) {
          return { ...currentPagination, total: Math.max(0, currentPagination.total - 1) };
        }
        return currentPagination;
      });

      // Close modal if deleted request was selected
      setSelectedRequest((currentSelected) => {
        if (currentSelected?._id === requestId) {
          setShowUpdateStatus(false);
          return null;
        }
        return currentSelected;
      });
    };

    // Setup listeners
    const setupListeners = () => {
      console.log('RequestManagement: Setting up socket listeners...', {
        connected: socket.isConnected(),
        socketId: socket.getSocketId(),
      });

      // Register listeners
      socket.onRequestCreated(handleRequestCreated);
      socket.onRequestUpdated(handleRequestUpdated);
      socket.onRequestDeleted(handleRequestDeleted);

      console.log('✅ RequestManagement: Socket listeners registered successfully');
    };

    // Setup listeners immediately and after a delay to ensure socket is ready
    setupListeners();
    const timeout = setTimeout(setupListeners, 500);

    return () => {
      clearTimeout(timeout);
      // Cleanup listeners
      console.log('RequestManagement: Cleaning up socket listeners');
      socket.offRequestCreated(handleRequestCreated);
      socket.offRequestUpdated(handleRequestUpdated);
      socket.offRequestDeleted(handleRequestDeleted);
    };
  }, [socket, user?.role]); // Minimal dependencies to prevent re-registration

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
    setShowUpdateStatus(false);
  };

  const handleUpdate = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowUpdateStatus(true);
  };

  const handleDelete = (requestId: string) => {
    const request = requests.find(r => r._id === requestId);
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
      loadRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete request');
    }
  };

  const handleStatusUpdate = () => {
    setShowUpdateStatus(false);
    setSelectedRequest(null);
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
            Request Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
            Manage and track service requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Socket Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {connected ? 'Live' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={loadRequests}
            className="btn btn-secondary flex items-center space-x-2 text-sm px-3 py-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Analytics */}
      <RequestAnalytics categories={categories} />

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
          onClose={() => setSelectedRequest(null)}
          onUpdate={() => {
            setSelectedRequest(null);
            handleUpdate(selectedRequest);
          }}
          onDelete={() => {
            setSelectedRequest(null);
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

export default RequestManagement;

