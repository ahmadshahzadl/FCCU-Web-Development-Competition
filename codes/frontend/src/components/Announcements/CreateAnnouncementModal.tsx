import { useState } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import type { AnnouncementType, AnnouncementPriority, AnnouncementTarget, UserRole, CreateAnnouncementData } from '@/types';
import { X, Bell, Save, Info } from 'lucide-react';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateAnnouncementModal = ({ isOpen, onClose, onSuccess }: CreateAnnouncementModalProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<AnnouncementType>('notice');
  const [priority, setPriority] = useState<AnnouncementPriority>('medium');
  const [target, setTarget] = useState<AnnouncementTarget>('all');
  const [targetRoles, setTargetRoles] = useState<UserRole[]>([]);
  const [targetUserIds, setTargetUserIds] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  if (user?.role !== 'admin' && user?.role !== 'manager') {
    return null;
  }

  const handleRoleToggle = (role: UserRole) => {
    setTargetRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (target === 'roles' && targetRoles.length === 0) {
      setError('Please select at least one role');
      return;
    }

    if (target === 'users' && !targetUserIds.trim()) {
      setError('Please enter at least one user ID');
      return;
    }

    setLoading(true);

    try {
      const data: CreateAnnouncementData = {
        title: title.trim(),
        content: content.trim(),
        type,
        priority,
        target,
        ...(target === 'roles' && { targetRoles }),
        ...(target === 'users' && {
          targetUserIds: targetUserIds.split(',').map((id) => id.trim()).filter(Boolean),
        }),
      };

      await apiService.createAnnouncement(data);

      toast.success('Announcement created successfully!', {
        duration: 3000,
        position: 'top-right',
      });

      // Reset form
      setTitle('');
      setContent('');
      setType('notice');
      setPriority('medium');
      setTarget('all');
      setTargetRoles([]);
      setTargetUserIds('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create announcement';
      setError(errorMessage);
      toast.error('Failed to create announcement', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Bell className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Announcement</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg transition-colors duration-300">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full"
              required
              placeholder="Enter announcement title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="input w-full"
              required
              placeholder="Enter announcement content"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AnnouncementType)}
                className="input w-full"
              >
                <option value="notice">Notice</option>
                <option value="event">Event</option>
                <option value="cancellation">Cancellation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                className="input w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <select
              value={target}
              onChange={(e) => {
                setTarget(e.target.value as AnnouncementTarget);
                setTargetRoles([]);
                setTargetUserIds('');
              }}
              className="input w-full"
              required
            >
              <option value="all">All Users</option>
              <option value="roles">Specific Roles</option>
              <option value="users">Specific Users</option>
            </select>
          </div>

          {target === 'roles' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Roles <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                {(['admin', 'manager', 'team', 'student'] as UserRole[]).map((role) => (
                  <label 
                    key={role} 
                    className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                      targetRoles.includes(role)
                        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={targetRoles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {target === 'users' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                User IDs (comma-separated) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={targetUserIds}
                onChange={(e) => setTargetUserIds(e.target.value)}
                className="input w-full"
                placeholder="507f1f77bcf86cd799439012, 507f1f77bcf86cd799439013"
                required={target === 'users'}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter user IDs separated by commas
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary px-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center space-x-2 px-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Creating...' : 'Create Announcement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;

