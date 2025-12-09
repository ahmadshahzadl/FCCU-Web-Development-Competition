import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CreateMarkerRequest, UpdateMarkerRequest } from '@/types';

interface CreateMarkerModalProps {
  isOpen: boolean;
  editingMarker?: { _id: string } & CreateMarkerRequest;
  onSubmit: (data: CreateMarkerRequest | UpdateMarkerRequest) => Promise<void>;
  onClose: () => void;
}

const CreateMarkerModal = ({ isOpen, editingMarker, onSubmit, onClose }: CreateMarkerModalProps) => {
  const [formData, setFormData] = useState<CreateMarkerRequest>({
    name: '',
    category: '',
    description: '',
    latitude: 0,
    longitude: 0,
    address: '',
    contactInfo: '',
    openingHours: '',
    icon: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingMarker) {
      setFormData({
        name: editingMarker.name,
        category: editingMarker.category,
        description: editingMarker.description || '',
        latitude: editingMarker.latitude,
        longitude: editingMarker.longitude,
        address: editingMarker.address || '',
        contactInfo: editingMarker.contactInfo || '',
        openingHours: editingMarker.openingHours || '',
        icon: editingMarker.icon || '',
        isActive: editingMarker.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        latitude: 0,
        longitude: 0,
        address: '',
        contactInfo: '',
        openingHours: '',
        icon: '',
        isActive: true,
      });
    }
    setError('');
  }, [editingMarker, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.category.trim()) {
      setError('Category is required');
      return;
    }

    if (formData.latitude < -90 || formData.latitude > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingMarker ? 'update' : 'create'} marker. Please try again.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay - covers full viewport with blur including header */}
      <div
        className="fixed bg-black/50 dark:bg-black/70 z-[9998]"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          position: 'fixed',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto transition-colors duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between transition-colors duration-300">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {editingMarker ? 'Edit Marker' : 'Create Marker'}
            </h2>
            <button
              onClick={onClose}
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

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full h-10 text-sm transition-colors duration-300"
                placeholder="e.g., Main Library"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input w-full h-10 text-sm transition-colors duration-300"
                placeholder="e.g., library, facility, academic"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="input w-full text-sm transition-colors duration-300"
                placeholder="Optional description"
              />
            </div>

            {/* Latitude and Longitude */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  className="input w-full h-10 text-sm transition-colors duration-300"
                  required
                  min="-90"
                  max="90"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  className="input w-full h-10 text-sm transition-colors duration-300"
                  required
                  min="-180"
                  max="180"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input w-full h-10 text-sm transition-colors duration-300"
                placeholder="e.g., 123 Campus Drive"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Contact Info
              </label>
              <input
                type="text"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                className="input w-full h-10 text-sm transition-colors duration-300"
                placeholder="e.g., email@university.edu"
              />
            </div>

            {/* Opening Hours */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Opening Hours
              </label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="input w-full h-10 text-sm transition-colors duration-300"
                placeholder="e.g., Mon-Fri: 8AM-10PM"
              />
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Icon
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="input w-full h-10 text-sm transition-colors duration-300"
                placeholder="e.g., library, building"
              />
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 dark:text-primary-400 border-gray-300 dark:border-gray-700 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Active (visible to users)
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
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
                {loading ? (editingMarker ? 'Updating...' : 'Creating...') : editingMarker ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateMarkerModal;

