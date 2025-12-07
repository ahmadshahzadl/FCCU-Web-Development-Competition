import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Bell,
  History,
  BarChart3,
  MessageSquare,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/request', label: 'Submit Request', icon: FileText },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/map', label: 'Campus Map', icon: MapPin },
    { path: '/announcements', label: 'Announcements', icon: Bell },
    { path: '/history', label: 'Request History', icon: History },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="hidden lg:block w-64 bg-white shadow-md min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

