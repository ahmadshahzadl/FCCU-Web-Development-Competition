import { Link } from 'react-router-dom';
import { Home, Menu, Sun, Moon, X, LogOut, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
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
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="p-2 rounded-lg bg-primary-600 dark:bg-primary-500 text-white transition-all duration-300 shadow-sm shadow-primary-500/20 dark:shadow-primary-500/30">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
              Campus Helper
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300"
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
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300"
                >
                  <div className="p-1.5 rounded-full bg-primary-100 dark:bg-primary-900/40">
                    <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name || user.username}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role}
                    </div>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || user.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      <p className="text-xs text-primary-600 dark:text-primary-400 capitalize mt-1">
                        {user.role}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 transition-transform duration-300" />
              ) : (
                <Sun className="h-5 w-5 transition-transform duration-300" />
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 space-y-1 border-t border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
            <div className="px-4 py-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {user?.name || user?.username} ({user?.role})
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 rounded-lg transition-colors duration-300 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

