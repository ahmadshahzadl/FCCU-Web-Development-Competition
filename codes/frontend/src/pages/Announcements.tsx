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
        <div className="text-gray-600">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Announcements</h1>

      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('notice')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'notice'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Notices
            </button>
            <button
              onClick={() => setFilter('event')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'event'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setFilter('cancellation')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'cancellation'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No announcements found</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div key={announcement._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`badge ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                  <span className="badge bg-blue-100 text-blue-800">
                    {getAnnouncementTypeLabel(announcement.type)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(announcement.createdAt)}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{announcement.title}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;

