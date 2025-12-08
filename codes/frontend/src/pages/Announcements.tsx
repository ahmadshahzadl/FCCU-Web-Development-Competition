import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { Announcement, AnnouncementType } from '@/types';
import { getAnnouncementTypeLabel, formatDate, getPriorityColor } from '@/utils/helpers';
import { Bell, Filter } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AnnouncementType | 'all'>('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAnnouncements();
      setAnnouncements(data);
    } catch (error: any) {
      toast.error('Failed to fetch announcements');
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements =
    filter === 'all'
      ? announcements
      : announcements.filter((ann) => ann.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
        Announcements
      </h1>

      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-colors duration-300" />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                filter === 'all'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('notice')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                filter === 'notice'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Notices
            </button>
            <button
              onClick={() => setFilter('event')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                filter === 'event'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setFilter('cancellation')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                filter === 'cancellation'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Cancellations
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="card text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              No announcements found
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div key={announcement._id} className="card hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`badge ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                  <span className="badge bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                    {getAnnouncementTypeLabel(announcement.type)}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  {formatDate(announcement.createdAt)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                {announcement.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap transition-colors duration-300">
                {announcement.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;

