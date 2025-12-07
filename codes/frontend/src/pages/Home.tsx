import { Link } from 'react-router-dom';
import { FileText, MapPin, Bell, MessageSquare, BarChart3, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Campus Helper</h1>
        <p className="text-lg text-gray-600">
          Your one-stop platform for campus services, requests, and information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/request"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Submit Request</h3>
              <p className="text-sm text-gray-600">Report issues or request services</p>
            </div>
          </div>
        </Link>

        <Link
          to="/map"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Campus Map</h3>
              <p className="text-sm text-gray-600">Explore campus locations</p>
            </div>
          </div>
        </Link>

        <Link
          to="/announcements"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
              <Bell className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
              <p className="text-sm text-gray-600">Stay updated with campus news</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
              <p className="text-sm text-gray-600">View and manage requests</p>
            </div>
          </div>
        </Link>

        <Link
          to="/history"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Request History</h3>
              <p className="text-sm text-gray-600">Track your submitted requests</p>
            </div>
          </div>
        </Link>

        <Link
          to="/analytics"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">View request statistics</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
        <p className="mb-4 text-primary-100">
          Need help? Use our AI Campus Assistant to get instant answers to your questions.
        </p>
        <Link
          to="/request"
          className="inline-block bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;

