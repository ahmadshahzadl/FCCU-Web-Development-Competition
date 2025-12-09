/**
 * User Filters Component
 * 
 * Search and role filter controls
 */

import { Search, Filter, X } from 'lucide-react';
import type { UserRole } from '@/types';

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: UserRole | 'all';
  onRoleChange: (role: UserRole | 'all') => void;
}

const UserFilters = ({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
}: UserFiltersProps) => {
  return (
    <div className="card p-3 sm:p-4 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search by email, username, name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input pl-8 sm:pl-9 pr-8 sm:pr-9 h-9 sm:h-10 text-xs sm:text-sm w-full transition-colors duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300 p-0.5"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Role Filter */}
        <div className="flex items-center space-x-2 sm:w-auto w-full min-w-0">
          <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors duration-300" />
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole | 'all')}
            className="input h-9 sm:h-10 text-xs sm:text-sm flex-1 sm:w-auto min-w-0 transition-colors duration-300"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="team">Team</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;

