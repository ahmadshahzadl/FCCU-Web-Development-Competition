import { X, Calendar, User, FileText, MessageSquare, ExternalLink } from 'lucide-react';
import type { ServiceRequest, Category } from '@/types';
import { formatDate } from '@/utils/helpers';

interface RequestDetailsModalProps {
  request: ServiceRequest;
  categories: Category[];
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

const RequestDetailsModal = ({
  request,
  categories,
  onClose,
  onUpdate,
  onDelete,
}: RequestDetailsModalProps) => {
  const getCategoryName = (slug: string) => {
    return categories.find((c) => c.slug === slug)?.name || slug;
  };

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

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between transition-colors duration-300">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Request Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110 active:scale-95"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Category */}
          <div className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg transition-colors duration-300">
            <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                Category
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getCategoryName(request.category)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg transition-colors duration-300">
            <MessageSquare className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                Description
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                {request.description}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg transition-colors duration-300">
            <div className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                Status
              </p>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium transition-colors duration-300 ${getStatusBadgeColor(
                  request.status
                )}`}
              >
                {request.status}
              </span>
            </div>
          </div>

          {/* Student */}
          {request.studentName && (
            <div className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg transition-colors duration-300">
              <User className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  Student
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {request.studentName}
                </p>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          {request.adminNotes && (
            <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg transition-colors duration-300">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-0.5">
                  Admin Notes
                </p>
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {request.adminNotes}
                </p>
              </div>
            </div>
          )}

          {/* Attachment */}
          {request.attachmentUrl && (
            <div className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg transition-colors duration-300">
              <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  Attachment
                </p>
                <a
                  href={request.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-300 inline-flex items-center space-x-1"
                >
                  <span>View Attachment</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Resolved At */}
          {request.resolvedAt && (
            <div className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg transition-colors duration-300">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  Resolved At
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(request.resolvedAt)}
                </p>
              </div>
            </div>
          )}

          {/* Created At */}
          <div className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg transition-colors duration-300">
            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                Created
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(request.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-end space-x-2 transition-colors duration-300">
          <button
            onClick={onUpdate}
            className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200"
          >
            Update Status
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 dark:bg-red-500 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;

