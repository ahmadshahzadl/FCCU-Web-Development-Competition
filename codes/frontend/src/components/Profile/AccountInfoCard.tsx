/**
 * Account Information Card Component
 * 
 * Displays account information in the sidebar
 */

import { Hash, Calendar } from 'lucide-react';
import type { User } from '@/types';

interface AccountInfoCardProps {
  user: User;
}

const AccountInfoCard = ({ user }: AccountInfoCardProps) => {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <Hash className="h-4 w-4 text-primary-600 dark:text-primary-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Account Information
        </h3>
      </div>
      <div className="space-y-3">
        {/* Roll Number */}
        <div className="p-3 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="flex items-center space-x-2 mb-1.5">
            <Hash className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wide">
              Roll Number
            </p>
          </div>
          <p className="text-base font-bold text-primary-900 dark:text-primary-100 font-mono">
            {user.username}
          </p>
        </div>

        {/* Student ID (if available) */}
        {user.studentId && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Student ID
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
              {user.studentId}
            </p>
          </div>
        )}

        {/* Member Since */}
        {user.createdAt && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Member Since
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(user.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}

        {/* Last Updated */}
        {user.updatedAt && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Last Updated
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(user.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountInfoCard;

