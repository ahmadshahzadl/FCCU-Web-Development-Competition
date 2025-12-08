import { CheckCircle2, Trash2, Clock, User, FileText } from 'lucide-react';
import type { Announcement, AnnouncementType } from '@/types';
import { getAnnouncementTypeLabel, formatDate, getPriorityColor } from '@/utils/helpers';

interface AnnouncementCardProps {
  announcement: Announcement;
  isRead: boolean;
  isAdminOrManager: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnnouncementCard = ({
  announcement,
  isRead,
  isAdminOrManager,
  onMarkAsRead,
  onDelete,
}: AnnouncementCardProps) => {
  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case 'notice':
        return '📢';
      case 'event':
        return '📅';
      case 'cancellation':
        return '❌';
      case 'request-update':
        return '📝';
      default:
        return '📢';
    }
  };

  const getTypeColor = (type: AnnouncementType) => {
    switch (type) {
      case 'notice':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'event':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'cancellation':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'request-update':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div
      className={`card hover:shadow-lg transition-all duration-300 ${
        !isRead
          ? 'border-l-4 border-l-primary-500 dark:border-l-primary-400 bg-primary-50/30 dark:bg-primary-900/10'
          : 'border-l-4 border-l-transparent'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className={`p-3 rounded-xl ${getTypeColor(announcement.type)} transition-colors duration-300`}>
            <span className="text-2xl">{getTypeIcon(announcement.type)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {announcement.title}
              </h3>
              {!isRead && (
                <span className="flex-shrink-0 w-3 h-3 bg-primary-600 dark:bg-primary-400 rounded-full mt-1.5 animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{formatDate(announcement.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span className="capitalize">{announcement.createdByRole}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className={`badge ${getPriorityColor(announcement.priority)}`}>
          {announcement.priority}
        </span>
        <span className={`badge border ${getTypeColor(announcement.type)}`}>
          {getAnnouncementTypeLabel(announcement.type)}
        </span>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed transition-colors duration-300">
          {announcement.content}
        </p>
      </div>

      {/* Related Request */}
      {announcement.relatedRequestId && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg transition-colors duration-300">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 transition-colors duration-300">
              Related to request: <span className="font-mono">{announcement.relatedRequestId}</span>
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
          Created by <span className="font-medium">{announcement.createdBy}</span>
        </p>
        <div className="flex gap-2 flex-wrap">
          {!isRead && (
            <button
              onClick={() => onMarkAsRead(announcement._id)}
              className="btn btn-secondary flex items-center space-x-2 text-sm px-3 py-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark as Read</span>
            </button>
          )}
          {isAdminOrManager && (
            <button
              onClick={() => onDelete(announcement._id)}
              className="btn btn-danger flex items-center space-x-2 text-sm px-3 py-1.5"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;

