import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { RefreshCw, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import type { ServiceRequest, RequestStatus, Category } from '@/types';
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

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadRequests();
  }, [filters]);

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
        <button
          onClick={loadRequests}
          className="btn btn-secondary flex items-center space-x-2 text-sm px-3 py-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
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

