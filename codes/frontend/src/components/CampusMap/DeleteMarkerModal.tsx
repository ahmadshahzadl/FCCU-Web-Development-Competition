import { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteMarkerModalProps {
  isOpen: boolean;
  markerName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteMarkerModal = ({
  isOpen,
  markerName,
  onConfirm,
  onCancel,
}: DeleteMarkerModalProps) => {
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
        onClick={onCancel}
      />
      {/* Modal content */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full pointer-events-auto transition-colors duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between transition-colors duration-300">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Delete Marker
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110 active:scale-95"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Are you sure you want to delete the marker <strong>"{markerName}"</strong>?
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium transition-colors duration-300">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-2 transition-colors duration-300">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 dark:bg-red-500 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteMarkerModal;

