/**
 * Profile Header Component
 * 
 * Displays user avatar, name, and role badge
 */

import { Shield, UserCog, Briefcase, GraduationCap, User as UserIcon } from 'lucide-react';
import { getRoleDisplayName, getRoleBadgeColor } from '@/utils/auth.helpers';
import type { UserRole } from '@/types';

interface ProfileHeaderProps {
  name: string;
  username: string;
  role: UserRole;
}

const ProfileHeader = ({ name, username, role }: ProfileHeaderProps) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-6 w-6" />;
      case 'manager':
        return <UserCog className="h-6 w-6" />;
      case 'team':
        return <Briefcase className="h-6 w-6" />;
      case 'student':
        return <GraduationCap className="h-6 w-6" />;
      default:
        return <UserIcon className="h-6 w-6" />;
    }
  };

  return (
    <div className="card overflow-hidden p-0">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 px-5 py-5">
        <div className="flex items-center space-x-3">
          <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
            {getRoleIcon(role)}
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-xl font-bold">
              {name || username || 'User'}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm ${getRoleBadgeColor(role)}`}>
                {getRoleIcon(role)}
                <span className="ml-1.5 text-white">{getRoleDisplayName(role)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

