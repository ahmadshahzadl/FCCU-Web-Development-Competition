/**
 * User Create/Edit Modal Component
 * 
 * Compact modal for creating or editing users
 */

import { useState, useCallback, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import type { User, UserRole, CreateUserRequest } from '@/types';
import EmailInputWithDomain from '@/components/Form/EmailInputWithDomain';

interface UserCreateEditModalProps {
  isOpen: boolean;
  editingUser: User | null;
  formData: CreateUserRequest;
  onFormDataChange: (data: CreateUserRequest | ((prev: CreateUserRequest) => CreateUserRequest)) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isManager: boolean;
  isAdmin: boolean;
}

const UserCreateEditModal = ({
  isOpen,
  editingUser,
  formData,
  onFormDataChange,
  onSubmit,
  onClose,
  isManager,
  isAdmin,
}: UserCreateEditModalProps) => {
  const [showPassword, setShowPassword] = useState(false);

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

  // Helper function to update form data fields
  // Use functional update pattern to avoid stale closure issues
  const updateField = useCallback((field: keyof CreateUserRequest, value: any) => {
    onFormDataChange((prev: CreateUserRequest) => ({ ...prev, [field]: value }));
  }, [onFormDataChange]);

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
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 pointer-events-none">
        <div 
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {editingUser ? 'Edit User' : 'Create User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 touch-manipulation p-1"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <EmailInputWithDomain
              value={formData.email}
              onChange={(email) => updateField('email', email)}
              required
              className="h-10 text-sm"
              placeholder="username"
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {formData.role === 'student' ? 'Roll Number' : 'Username'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.username || ''}
              onChange={(e) => updateField('username', e.target.value)}
              className="input w-full h-10 text-sm"
              placeholder={formData.role === 'student' ? 'Roll number' : 'username'}
            />
          </div>

          {/* Password (only for new users) */}
          {!editingUser && (
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password || ''}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="input w-full h-10 text-sm pr-10"
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              className="input w-full h-10 text-sm"
              placeholder="John Doe"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => updateField('role', e.target.value as UserRole)}
              className="input w-full h-10 text-sm"
              disabled={isManager && !editingUser}
            >
              {isAdmin && (
                <>
                  <option value="student">Student</option>
                  <option value="team">Team</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </>
              )}
              {isManager && (
                <>
                  <option value="student">Student</option>
                  <option value="team">Team</option>
                </>
              )}
            </select>
            {isManager && !editingUser && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Managers can only create team and student users
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 touch-manipulation"
            >
              {editingUser ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default UserCreateEditModal;

