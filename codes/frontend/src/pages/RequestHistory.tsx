import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import type { ServiceRequest } from '@/types';
import { getStatusColor, formatDate, generateRequestId } from '@/utils/helpers';
import { Clock, MessageSquare, ExternalLink } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

const RequestHistory = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const handleRequestUpdate = useCallback((payload: { request: ServiceRequest; updatedBy?: string }) => {
    const { request } = payload;
    
    // Update the request in the list
    setRequests((prev) =>
      prev.map((req) => (req._id === request._id ? request : req))
    );

    // Show toast notification based on status
    if (request.status === 'resolved') {
      toast.success(
        `Your request has been resolved!${request.adminNotes ? ` Notes: ${request.adminNotes}` : ''}`,
        {
          duration: 5000,
        }
      );
    } else if (request.status === 'in-progress') {
      toast.info('Your request is now in progress!', {
        duration: 3000,
      });
    } else {
      toast.info('Your request has been updated.', {
        duration: 3000,
      });
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchUserRequests();
      loadCategories();
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && socket) {
      // Setup socket listeners
      socket.onUserRequestUpdated(handleRequestUpdate);

      return () => {
        // Cleanup socket listeners
        socket.offUserRequestUpdated(handleRequestUpdate);
      };
    }
  }, [user?.id, socket, handleRequestUpdate]);

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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
        Request History
      </h1>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="card text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
            <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
              No requests found
            </p>
            <Link to="/request" className="btn btn-primary">
              Submit Your First Request
            </Link>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="card hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                      {generateRequestId(request._id)}
                    </h3>
                    <span className={`badge ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                      {getCategoryName(request.category)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    {request.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    <span>Created: {formatDate(request.createdAt)}</span>
                    {request.updatedAt !== request.createdAt && (
                      <span>Updated: {formatDate(request.updatedAt)}</span>
                    )}
                    {request.resolvedAt && (
                      <span>Resolved: {formatDate(request.resolvedAt)}</span>
                    )}
                  </div>
                </div>
                <Link
                  to={`/chat/${request._id}`}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat</span>
                </Link>
              </div>
              {request.adminNotes && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-500 dark:border-blue-400 transition-colors duration-300">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1 transition-colors duration-300">
                    Admin Notes:
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 transition-colors duration-300 whitespace-pre-wrap">
                    {request.adminNotes}
                  </p>
                </div>
              )}

              {request.attachmentUrl && (
                <div className="mt-4">
                  <a
                    href={request.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Attachment</span>
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestHistory;

