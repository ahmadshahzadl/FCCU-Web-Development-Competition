import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors duration-300">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <Link
            to="/"
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

