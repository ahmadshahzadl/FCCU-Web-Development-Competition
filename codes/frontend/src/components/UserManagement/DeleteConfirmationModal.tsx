/**
 * Delete Confirmation Modal Component
 * 
 * Confirmation dialog for deleting users
 */

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal = ({
  isOpen,
  userName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => {
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
          WebkitBackdropFilter: 'blur(12px)'
        }}
        onClick={onCancel}
      />
      {/* Modal content */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{userName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-500 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;

