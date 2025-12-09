import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ServiceRequest, Category } from '@/types';

interface RequestTableProps {
  requests: ServiceRequest[];
  categories: Category[];
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  onView: (request: ServiceRequest) => void;
  onUpdate: (request: ServiceRequest) => void;
  onDelete: (requestId: string) => void;
  onPageChange: (page: number) => void;
}

const RequestTable = ({
  requests,
  categories,
  loading,
  pagination,
  onView,
  onUpdate,
  onDelete,
  onPageChange,
}: RequestTableProps) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getCategoryName = (slug: string) => {
    return categories.find((c) => c.slug === slug)?.name || slug;
  };

  if (loading && requests.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading requests...</div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <p>No requests found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden p-0 transition-colors duration-300">
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <tr>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                  ID
                </th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                  Category
                </th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell transition-colors duration-300">
                  Description
                </th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                  Student
                </th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell transition-colors duration-300">
                  Created
                </th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 transition-colors duration-300">
              {requests.map((request) => (
                <tr
                  key={request._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-300"
                >
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white transition-colors duration-300 font-mono">
                    {request._id.substring(0, 8)}...
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm transition-colors duration-300">
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 transition-colors duration-300">
                      {getCategoryName(request.category)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-white hidden md:table-cell transition-colors duration-300">
                    <div className="max-w-xs truncate">
                      {request.description.length > 50
                        ? `${request.description.substring(0, 50)}...`
                        : request.description}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white transition-colors duration-300">
                    <div className="max-w-[120px] truncate">
                      {request.studentName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm transition-colors duration-300">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium transition-colors duration-300 ${getStatusBadgeColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell transition-colors duration-300">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm transition-colors duration-300">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => onView(request)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-300 p-1 sm:p-1.5 touch-manipulation"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => onUpdate(request)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-300 p-1 sm:p-1.5 touch-manipulation"
                        title="Update status"
                      >
                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(request._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-300 p-1 sm:p-1.5 touch-manipulation"
                        title="Delete request"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-2 sm:px-0">
          <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300 text-center sm:text-left">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} requests
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 touch-manipulation"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>
            <span className="px-2 sm:px-4 py-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300 whitespace-nowrap">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 touch-manipulation"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestTable;

