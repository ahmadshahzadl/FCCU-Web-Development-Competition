import { ExternalLink } from 'lucide-react';
import type { ServiceRequest } from '@/types';
import { getStatusColor, formatDate, generateRequestId } from '@/utils/helpers';

interface RequestHistoryCardProps {
  request: ServiceRequest;
  categoryName: string;
  isUpdating?: boolean;
}

const RequestHistoryCard = ({ request, categoryName, isUpdating }: RequestHistoryCardProps) => {
  return (
    <div
      className={`card hover:shadow-lg transition-all duration-300 ${
        isUpdating
          ? 'ring-2 ring-primary-500 dark:ring-primary-400 bg-primary-50/50 dark:bg-primary-900/20'
          : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              {generateRequestId(request._id)}
            </h3>
            <span className={`badge ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
            <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              {categoryName}
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
  );
};

export default RequestHistoryCard;

