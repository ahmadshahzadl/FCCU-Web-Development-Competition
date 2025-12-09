/**
 * User Statistics Cards Component
 * 
 * Displays user statistics in card format
 */

import { Users, Shield, UserCog, Briefcase, GraduationCap } from 'lucide-react';

interface UserStatsCardsProps {
  stats: {
    total: number;
    byRole: {
      admin: number;
      manager: number;
      team: number;
      student: number;
    };
  };
  isManager?: boolean;
}

const UserStatsCards = ({ stats, isManager = false }: UserStatsCardsProps) => {
  // For managers, show 4 cards (Total, Managers, Team, Students)
  // For admins, show 5 cards (Total, Admins, Managers, Team, Students)
  const gridCols = isManager ? 'md:grid-cols-4' : 'md:grid-cols-5';
  
  return (
    <div className={`grid grid-cols-2 ${gridCols} gap-2 sm:gap-3 md:gap-4 transition-colors duration-300`}>
      <div className="card p-3 sm:p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 truncate">Total</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{stats.total}</p>
          </div>
          <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary-600 dark:text-primary-400 flex-shrink-0 transition-colors duration-300 ml-2" />
        </div>
      </div>
      {!isManager && (
        <div className="card p-3 sm:p-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 truncate">Admins</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{stats.byRole.admin}</p>
            </div>
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-red-600 dark:text-red-400 flex-shrink-0 transition-colors duration-300 ml-2" />
          </div>
        </div>
      )}
      <div className="card p-3 sm:p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 truncate">Managers</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{stats.byRole.manager}</p>
          </div>
          <UserCog className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-purple-600 dark:text-purple-400 flex-shrink-0 transition-colors duration-300 ml-2" />
        </div>
      </div>
      <div className="card p-3 sm:p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 truncate">Team</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{stats.byRole.team}</p>
          </div>
          <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-colors duration-300 ml-2" />
        </div>
      </div>
      <div className="card p-3 sm:p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 truncate">Students</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{stats.byRole.student}</p>
          </div>
          <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-green-600 dark:text-green-400 flex-shrink-0 transition-colors duration-300 ml-2" />
        </div>
      </div>
    </div>
  );
};

export default UserStatsCards;

