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
  Settings,
  Sun,
  Moon,
  LogOut,
  User,
  X,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSidebar } from './Layout';
import AnnouncementBadge from '@/components/Announcements/AnnouncementBadge';
import type { UserRole } from '@/types';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const Sidebar = () => {
  const location = useLocation();
  const { hasRole, user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isOpen, closeSidebar } = useSidebar();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isStudent = user?.role === 'student';

  const handleLogout = () => {
    signOut();
    setUserMenuOpen(false);
    closeSidebar();
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isOpen) return;

    let cleanup: (() => void) | null = null;

    // Add a small delay to prevent immediate closure when opening
    const timeoutId = setTimeout(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const sidebar = document.querySelector('[data-sidebar]');
        const hamburger = document.querySelector('[data-hamburger-button]');
        
        // Don't close if clicking on sidebar or hamburger button
        if (
          sidebar &&
          !sidebar.contains(target) &&
          hamburger &&
          !hamburger.contains(target)
        ) {
          closeSidebar();
        }
      };

      // Use capture phase to catch events before they bubble
      document.addEventListener('mousedown', handleClickOutside, true);
      
      cleanup = () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) {
        cleanup();
      }
    };
  }, [isOpen, closeSidebar]);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Close sidebar when route changes on mobile (only if it's open)
  useEffect(() => {
    if (isOpen) {
      closeSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const allMenuItems: MenuItem[] = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/request', label: 'Submit Request', icon: FileText, roles: ['student'] },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'team'] },
    { path: '/map', label: 'Campus Map', icon: MapPin },
    { path: '/announcements', label: 'Announcements', icon: Bell },
    { path: '/history', label: 'Request History', icon: History, roles: ['student', 'team'] },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'manager'] },
    { path: '/profile', label: 'My Profile', icon: UserCircle },
    { path: '/users', label: 'User Management', icon: Users, roles: ['admin', 'manager'] },
    { path: '/requests', label: 'Request Management', icon: ClipboardList, roles: ['admin', 'manager'] },
    { path: '/team-requests', label: 'Requests', icon: ClipboardList, roles: ['team'] },
    { path: '/categories', label: 'Category Management', icon: FolderTree, roles: ['admin', 'manager'] },
    { path: '/system-config', label: 'System Configuration', icon: Settings, roles: ['admin'] },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) => {
    if (!item.roles) return true; // Show to all if no roles specified
    return hasRole(item.roles);
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        data-sidebar
        className={`fixed lg:sticky top-14 sm:top-16 left-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-72 sm:w-64 glass-sidebar z-[60] transform transition-transform duration-300 ease-in-out border-r border-gray-200/50 dark:border-gray-800/50 ${
          isOpen 
            ? 'translate-x-0' 
            : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="h-full flex flex-col p-3 sm:p-4 overflow-y-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200/50 dark:border-gray-800/50">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={closeSidebar}
              className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300 touch-manipulation"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center space-x-2 sm:space-x-3 px-2.5 sm:px-3 py-2 sm:py-2.5 text-sm font-medium rounded-lg transition-all duration-300 touch-manipulation ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/40 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 flex-shrink-0 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  <span className="transition-colors duration-300 truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-800/50 space-y-1">
            {/* Chat Support (Students Only) */}
            {isStudent && (
              <Link
                to="/chat"
                onClick={closeSidebar}
                className="flex items-center space-x-2 sm:space-x-3 px-2.5 sm:px-3 py-2 sm:py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300 touch-manipulation"
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 transition-colors duration-300 flex-shrink-0" />
                <span className="transition-colors duration-300 truncate">Chat Support</span>
              </Link>
            )}

            {/* Mobile/Tablet User Actions */}
            <div className="lg:hidden space-y-1">
              {/* Announcements */}
              <div className="px-2.5 sm:px-3 py-2 sm:py-2.5">
                <AnnouncementBadge />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center space-x-2 sm:space-x-3 px-2.5 sm:px-3 py-2 sm:py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300 touch-manipulation"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                ) : (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                )}
                <span className="truncate">Toggle Theme</span>
              </button>

              {/* User Menu */}
              {user && (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-full flex items-center space-x-2 sm:space-x-3 px-2.5 sm:px-3 py-2 sm:py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300 touch-manipulation"
                  >
                    <div className="p-1.5 rounded-full bg-primary-100 dark:bg-primary-900/40 flex-shrink-0">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium truncate">{user.name || user.username}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                        {user.role}
                      </div>
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="mt-1 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name || user.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => {
                          setUserMenuOpen(false);
                          closeSidebar();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

