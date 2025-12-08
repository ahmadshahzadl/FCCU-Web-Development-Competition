import { useState } from 'react';
import { X } from 'lucide-react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { RequestStatus, UpdateRequestStatusData } from '@/types';

interface UpdateRequestStatusModalProps {
  requestId: string;
  currentStatus: RequestStatus;
  currentNotes?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UpdateRequestStatusModal = ({
  requestId,
  currentStatus,
  currentNotes,
  onSuccess,
  onCancel,
}: UpdateRequestStatusModalProps) => {
  const [status, setStatus] = useState<RequestStatus>(currentStatus);
  const [adminNotes, setAdminNotes] = useState(currentNotes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!status) {
      setError('Status is required');
      return;
    }

    setLoading(true);

    try {
      const updateData: UpdateRequestStatusData = {
        status,
        adminNotes: adminNotes.trim() || undefined,
      };

      await apiService.updateRequestStatus(requestId, {
        status,
        adminNotes: adminNotes.trim() || undefined,
      });
      toast.success('Request status updated successfully');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to update status';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full transition-colors duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between transition-colors duration-300">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Update Request Status
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110 active:scale-95"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm transition-colors duration-300">
              {error}
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RequestStatus)}
              className="input w-full h-10 text-sm transition-colors duration-300"
              required
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Admin Notes (Optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="input w-full text-sm transition-colors duration-300"
              placeholder="Add notes about this request..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRequestStatusModal;

