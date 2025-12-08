import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Bell,
  History,
  BarChart3,
  MessageSquare,
  Users,
  UserCircle,
  ClipboardList,
  FolderTree,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const Sidebar = () => {
  const location = useLocation();
  const { hasRole, user } = useAuth();
  const isStudent = user?.role === 'student';

  const allMenuItems: MenuItem[] = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/request', label: 'Submit Request', icon: FileText, roles: ['student'] },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'team'] },
    { path: '/map', label: 'Campus Map', icon: MapPin },
    { path: '/announcements', label: 'Announcements', icon: Bell },
    { path: '/history', label: 'Request History', icon: History },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'manager'] },
    { path: '/profile', label: 'My Profile', icon: UserCircle },
    { path: '/users', label: 'User Management', icon: Users, roles: ['admin', 'manager'] },
    { path: '/requests', label: 'Request Management', icon: ClipboardList, roles: ['admin', 'manager'] },
    { path: '/categories', label: 'Category Management', icon: FolderTree, roles: ['admin', 'manager'] },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) => {
    if (!item.roles) return true; // Show to all if no roles specified
    return hasRole(item.roles);
  });

  return (
    <aside className="hidden lg:block w-64 glass-sidebar min-h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                isActive
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/40 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
              }`}
            >
                <Icon 
                  className={`h-5 w-5 transition-colors duration-300 ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`} 
                />
                <span className="transition-colors duration-300">{item.label}</span>
            </Link>
          );
        })}
        </div>
        
        {/* Bottom Section - Chat Support (Students Only) */}
        {isStudent && (
          <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
            <Link
              to="/chat"
              className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300"
            >
              <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-colors duration-300" />
              <span className="transition-colors duration-300">Chat Support</span>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

