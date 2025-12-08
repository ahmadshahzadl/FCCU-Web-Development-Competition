import { Link } from 'react-router-dom';
import { FileText, MapPin, Bell, MessageSquare, BarChart3, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
          Welcome to Campus Helper
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Your one-stop platform for campus services, requests, and information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isStudent && (
          <Link
            to="/request"
            className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/40 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/60 transition-colors">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  Submit Request
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Report issues or request services
                </p>
              </div>
            </div>
          </Link>
        )}

        <Link
          to="/map"
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
              <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Campus Map
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Explore campus locations
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/announcements"
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg group-hover:bg-amber-200 dark:group-hover:bg-amber-900/60 transition-colors">
              <Bell className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Announcements
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Stay updated with campus news
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard"
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Dashboard
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                View and manage requests
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/history"
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60 transition-colors">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Request History
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Track your submitted requests
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/analytics"
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60 transition-colors">
              <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                View request statistics
              </p>
            </div>
          </div>
        </Link>
      </div>

      {isStudent && (
        <div className="card bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white border-0 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
          <p className="mb-4 text-primary-50 dark:text-primary-100">
            Need help? Use our AI Campus Assistant to get instant answers to your questions.
          </p>
          <Link
            to="/request"
            className="inline-block bg-white dark:bg-gray-100 text-primary-600 dark:text-primary-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-300"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

