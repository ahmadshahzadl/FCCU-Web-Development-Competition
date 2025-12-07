import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, Home } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      // Error is already handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-primary-600 dark:bg-primary-500 text-white shadow-lg">
              <Home className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Campus Helper
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Sign in to your account to continue
          </p>
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
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="h-5 w-5" />
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Demo Credentials (Password: password)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail('student@campus.edu');
                  setPassword('password');
                }}
                className="px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors duration-300 border border-primary-200 dark:border-primary-800/50"
              >
                <div className="font-medium">Student</div>
                <div className="text-xs opacity-75">student@campus.edu</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@campus.edu');
                  setPassword('password');
                }}
                className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-300 border border-blue-200 dark:border-blue-800/50"
              >
                <div className="font-medium">Admin</div>
                <div className="text-xs opacity-75">admin@campus.edu</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('team@campus.edu');
                  setPassword('password');
                }}
                className="px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors duration-300 border border-green-200 dark:border-green-800/50"
              >
                <div className="font-medium">Team</div>
                <div className="text-xs opacity-75">team@campus.edu</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('manager@campus.edu');
                  setPassword('password');
                }}
                className="px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors duration-300 border border-purple-200 dark:border-purple-800/50"
              >
                <div className="font-medium">Manager</div>
                <div className="text-xs opacity-75">manager@campus.edu</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

