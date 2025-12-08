import { Link } from 'react-router-dom';
import { Home, Menu, Sun, Moon, LogOut, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSystemConfig } from '@/contexts/SystemConfigContext';
import { useSidebar } from './Layout';
import AnnouncementBadge from '@/components/Announcements/AnnouncementBadge';

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { config: systemConfig, loading: configLoading } = useSystemConfig();
  const { toggleSidebar } = useSidebar();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    signOut();
    setUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left Section: Logo Only */}
          <div className="flex items-center min-w-0 flex-1">
            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-3 group transition-transform duration-200 hover:scale-[1.02] active:scale-95 min-w-0"
            >
              {configLoading ? (
                <>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0" />
                  <div className="h-4 sm:h-5 md:h-6 w-20 sm:w-24 md:w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse hidden sm:block" />
                </>
              ) : (
                <>
                  {systemConfig?.logoUrl ? (
                    <img
                      src={systemConfig.logoUrl}
                      alt={`${systemConfig.projectName} Logo`}
                      className="h-8 w-auto sm:h-9 md:h-10 object-contain flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary-600 dark:bg-primary-500 text-white transition-all duration-300 shadow-sm shadow-primary-500/20 dark:shadow-primary-500/30 flex-shrink-0">
                      <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </div>
                  )}
                  <span className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white tracking-tight transition-colors duration-300 hidden sm:inline-block truncate">
                    {systemConfig?.projectName || 'Campus Helper'}
                  </span>
                </>
              )}
            </Link>
          </div>

          {/* Right Section: Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Announcement Badge */}
            <AnnouncementBadge />
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300 active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 transition-transform duration-300" />
              ) : (
                <Sun className="h-5 w-5 transition-transform duration-300" />
              )}
            </button>

            {/* User Menu */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300 active:scale-95"
                >
                  <div className="p-1.5 rounded-full bg-primary-100 dark:bg-primary-900/40">
                    <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name || user.username}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role}
                    </div>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 py-1 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || user.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
                      <p className="text-xs text-primary-600 dark:text-primary-400 capitalize mt-1.5 font-medium">
                        {user.role}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
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

          {/* Mobile/Tablet: Announcement Badge + Theme Toggle + Hamburger */}
          <div className="lg:hidden flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* Announcement Badge */}
            <AnnouncementBadge />
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300 active:scale-95 touch-manipulation"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" />
              )}
            </button>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSidebar();
              }}
              className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300 active:scale-95 touch-manipulation"
              aria-label="Toggle sidebar"
              data-hamburger-button
              type="button"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

