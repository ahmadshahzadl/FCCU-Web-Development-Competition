/**
 * Login Page Component
 * 
 * Provides sign-in functionality with email and password
 * Includes form validation and error handling
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSystemConfig } from '@/contexts/SystemConfigContext';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, Home, Eye, EyeOff, X, Info, AlertCircle, RefreshCw } from 'lucide-react';
import { getDefaultRedirectPath } from '@/utils/auth.helpers';
import { usePageTitle } from '@/hooks/usePageTitle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [canRetry, setCanRetry] = useState(true);
  const { signIn } = useAuth();
  const { config: systemConfig, loading: configLoading } = useSystemConfig();
  const navigate = useNavigate();
  const location = useLocation();
  
  usePageTitle('Sign In');

  // Countdown timer for rate limiting
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => {
          if (prev === null || prev <= 1) {
            setCanRetry(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  /**
   * Get redirect path based on user role
   */
  const getRedirectPath = (role: string): string => {
    // Check if there's a redirect path in location state (from ProtectedRoute)
    const from = (location.state as any)?.from?.pathname;
    if (from) return from;

    // Use helper function for default redirects
    return getDefaultRedirectPath(role as any);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setRetryAfter(null);
    
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Check if user can retry (rate limiting)
    if (!canRetry) {
      toast.error(`Please wait ${retryAfter} seconds before trying again`);
      return;
    }

    setLoading(true);
    try {
      const userData = await signIn({ email: email.trim(), password });
      
      // Clear any errors on success
      setError(null);
      setRetryAfter(null);
      
      // Redirect based on user role
      const redirectPath = getRedirectPath(userData.role);
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      // Handle specific error types
      const errorMessage = error.message || 'Sign in failed. Please check your credentials.';
      setError(errorMessage);
      
      // Handle 429 Rate Limiting errors
      if (errorMessage.includes('Too many requests') || errorMessage.includes('try again after')) {
        // Extract retry time from error message
        const retryMatch = errorMessage.match(/(\d+)\s*seconds?/i);
        if (retryMatch) {
          const retrySeconds = parseInt(retryMatch[1], 10);
          setRetryAfter(retrySeconds);
          setCanRetry(false);
        } else {
          // Default retry after 60 seconds if not specified
          setRetryAfter(60);
          setCanRetry(false);
        }
        toast.error(errorMessage, {
          duration: 5000,
          icon: '⏱️',
        });
      } else if (errorMessage.includes('Network error') || errorMessage.includes('connection')) {
        toast.error('Network error. Please check your internet connection.', {
          duration: 4000,
        });
      } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('credentials')) {
        toast.error('Invalid email or password. Please try again.', {
          duration: 4000,
        });
      } else {
        // Generic error - already shown by AuthContext, but we show it here too for clarity
        toast.error(errorMessage, {
          duration: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          {configLoading ? (
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse mb-4" />
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                {systemConfig?.logoUrl ? (
                  <img
                    src={systemConfig.logoUrl}
                    alt={`${systemConfig.projectName} Logo`}
                    className="h-20 w-auto object-contain"
                    onError={(e) => {
                      // Hide image if it fails to load and show fallback
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`p-3 rounded-2xl bg-primary-600 dark:bg-primary-500 text-white shadow-lg transition-all duration-300 ${
                    systemConfig?.logoUrl ? 'hidden' : ''
                  }`}
                >
                  <Home className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {systemConfig?.projectName || 'Campus Helper'}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Sign in to your account to continue
              </p>
            </>
          )}
        </div>

        {/* Login Form */}
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 transition-all duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 transition-all duration-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      {error}
                    </p>
                    {retryAfter !== null && retryAfter > 0 && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Please wait {retryAfter} second{retryAfter !== 1 ? 's' : ''} before trying again.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-300"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !canRetry}
              className="btn btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : !canRetry ? (
                <>
                  <AlertCircle className="h-5 w-5" />
                  <span>Please wait {retryAfter}s</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign in</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Forgot Password?
              </h3>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110 active:scale-95"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    To reset your password, please contact the management team. They will help you regain access to your account.
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong className="text-gray-900 dark:text-white">Contact Information:</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reach out to your campus administration or IT support team for password assistance.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="btn btn-primary px-6"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;


