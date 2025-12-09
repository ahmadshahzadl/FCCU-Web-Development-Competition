/**
 * User Table Component
 * 
 * Displays users in a responsive table format
 */

import { Edit2, Trash2, Eye, Mail, User as UserIcon, Shield, UserCog, Briefcase, GraduationCap } from 'lucide-react';
import { getRoleDisplayName, getRoleBadgeColor } from '@/utils/auth.helpers';
import type { User, UserRole } from '@/types';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserTable = ({ users, loading, onView, onEdit, onDelete }: UserTableProps) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'manager':
        return <UserCog className="h-4 w-4" />;
      case 'team':
        return <Briefcase className="h-4 w-4" />;
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading users...</div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <UserIcon className="h-12 w-12 mb-4 opacity-50" />
          <p>No users found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0 transition-colors duration-300">
      <div className="overflow-x-auto -mx-1 sm:mx-0">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <tr>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                User
              </th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell transition-colors duration-300">
                Email
              </th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                Role
              </th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 transition-colors duration-300">
            {users.map((user, index) => {
              const isStudent = user.role === 'student';
              // Use id if available, otherwise fallback to email + index for uniqueness
              const userId = user.id || `${user.email}-${index}`;
              return (
                <tr
                  key={userId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-300"
                >
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 transition-colors duration-300">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center transition-colors duration-300">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate transition-colors duration-300">
                          {user.name || user.username}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate md:hidden transition-colors duration-300 mt-0.5">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors duration-300">
                          {isStudent ? `Roll: ${user.username}` : `@${user.username}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap hidden md:table-cell transition-colors duration-300">
                    <div className="flex items-center text-xs sm:text-sm text-gray-900 dark:text-white transition-colors duration-300">
                      <Mail className="h-3 w-3 mr-2 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors duration-300" />
                      <span className="truncate max-w-xs">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap transition-colors duration-300">
                    <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-300 ${getRoleBadgeColor(user.role)}`}>
                      <span className="hidden sm:inline">{getRoleIcon(user.role)}</span>
                      <span className="ml-0 sm:ml-1">{getRoleDisplayName(user.role)}</span>
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap transition-colors duration-300">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => onView(user)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-300 p-1 sm:p-1.5 touch-manipulation"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(user)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-300 p-1 sm:p-1.5 touch-manipulation"
                        title="Edit user"
                      >
                        <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(user.id || userId)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-300 p-1 sm:p-1.5 touch-manipulation"
                        title="Delete user"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;

