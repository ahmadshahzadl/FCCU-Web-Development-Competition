import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import type { ServiceRequest } from '@/types';
import { getStatusColor, getCategoryLabel, formatDate, generateRequestId } from '@/utils/helpers';
import { Clock, MessageSquare } from 'lucide-react';

const RequestHistory = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId') || 'demo-user'; // Replace with actual user ID

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUserRequests(userId);
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
        <div className="text-gray-600">Loading request history...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Request History</h1>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="card text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No requests found</p>
            <Link to="/request" className="btn btn-primary">
              Submit Your First Request
            </Link>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {generateRequestId(request._id)}
                    </h3>
                    <span className={`badge ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className="badge bg-gray-100 text-gray-800">
                      {getCategoryLabel(request.category)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{request.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Admin Notes:</p>
                  <p className="text-sm text-blue-800">{request.adminNotes}</p>
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

