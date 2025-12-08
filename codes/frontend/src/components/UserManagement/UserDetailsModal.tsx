/**
 * User Details Modal Component
 * 
 * Displays detailed information about a user in a modal
 */

import { X, Mail, Hash, Calendar, Shield, UserCog, Briefcase, GraduationCap, User as UserIcon } from 'lucide-react';
import { getRoleDisplayName, getRoleBadgeColor } from '@/utils/auth.helpers';
import type { User } from '@/types';
import { formatDate } from '@/utils/helpers';

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
}

const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5" />;
      case 'manager':
        return <UserCog className="h-5 w-5" />;
      case 'team':
        return <Briefcase className="h-5 w-5" />;
      case 'student':
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  const isStudent = user.role === 'student';

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between z-10">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110 active:scale-95 touch-manipulation p-1"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* User Avatar and Name */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 pb-2.5 sm:pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              {getRoleIcon(user.role)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                {user.name || user.username || 'User'}
              </h3>
              <span className={`inline-flex items-center mt-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                <span className="hidden sm:inline">{getRoleIcon(user.role)}</span>
                <span className="ml-0 sm:ml-1">{getRoleDisplayName(user.role)}</span>
              </span>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-start space-x-2.5 p-2.5 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Username / Roll Number */}
            <div className="flex items-start space-x-2.5 p-2.5 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <Hash className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  {isStudent ? 'Roll Number' : 'Username'}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                  {user.username}
                </p>
              </div>
            </div>

            {/* Full Name */}
            {user.name && (
              <div className="flex items-start space-x-2.5 p-2.5 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <UserIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                    Full Name
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                </div>
              </div>
            )}

            {/* Student ID (only for students) */}
            {isStudent && user.studentId && (
              <div className="flex items-start space-x-2.5 p-2.5 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <Hash className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wide mb-0.5">
                    Student ID
                  </p>
                  <p className="text-sm font-bold text-primary-900 dark:text-primary-100 font-mono">
                    {user.studentId}
                  </p>
                </div>
              </div>
            )}

            {/* Created At */}
            {user.createdAt && (
              <div className="flex items-start space-x-2.5 p-2.5 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                    Member Since
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Updated At */}
            {user.updatedAt && (
              <div className="flex items-start space-x-2.5 p-2.5 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 touch-manipulation"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;

