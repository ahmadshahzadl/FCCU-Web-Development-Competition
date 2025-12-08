/**
 * Profile Form Component
 * 
 * Main form for editing user profile with role-based restrictions
 */

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Mail, Hash, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import FormField from './FormField';
import FormFieldWithIcon from './FormFieldWithIcon';
import type { User, UpdateProfileRequest, UserRole } from '@/types';
import { getRoleDisplayName, getRoleBadgeColor } from '@/utils/auth.helpers';
import { Shield, UserCog, Briefcase, GraduationCap, User as UserIcon } from 'lucide-react';

interface ProfileFormProps {
  user: User;
  formData: UpdateProfileRequest;
  onFormDataChange: (data: UpdateProfileRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  onCancel: () => void;
}

const ProfileForm = ({
  user,
  formData,
  onFormDataChange,
  onSubmit,
  saving,
  onCancel,
}: ProfileFormProps) => {
  const canEditEmail = user.role === 'admin';
  const canEditUsername = user.role === 'admin';

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'manager':
        return <UserCog className="h-4 w-4" />;
      case 'team':
        return <Briefcase className="h-4 w-4" />;
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <FormField label="Full Name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name || ''}
            onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
            className="input w-full h-11 text-sm"
            placeholder="Enter your full name"
          />
        </FormField>

        {/* Email Field */}
        {canEditEmail ? (
          <FormFieldWithIcon
            label="Email Address"
            htmlFor="email"
            icon={Mail}
            value={formData.email || user.email}
            onChange={(email) => onFormDataChange({ ...formData, email })}
            type="email"
            placeholder="user@example.com"
            required
          />
        ) : (
          <FormFieldWithIcon
            label="Email Address"
            htmlFor="email"
            icon={Mail}
            value={user.email}
            onChange={() => {}}
            type="email"
            readOnly={true}
            readOnlyMessage="Email cannot be changed"
          />
        )}
      </div>

      {/* Roll Number and Role Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roll Number Field */}
        {canEditUsername ? (
          <FormFieldWithIcon
            label="Username"
            htmlFor="username"
            icon={Hash}
            value={formData.username || user.username}
            onChange={(username) => onFormDataChange({ ...formData, username })}
            placeholder="username"
            minLength={3}
            required
          />
        ) : (
          <FormFieldWithIcon
            label="Roll Number"
            htmlFor="username"
            icon={Hash}
            value={user.username}
            onChange={() => {}}
            readOnly={true}
            readOnlyMessage="Roll number cannot be changed"
          />
        )}

        {/* Role Field */}
        <FormField
          label="Role"
          htmlFor="role"
          helperText={
            <div className="flex items-center space-x-1.5">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Role cannot be changed</span>
            </div>
          }
        >
          <div className="flex items-center">
            <span className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
              {getRoleIcon(user.role)}
              <span className="ml-2">{getRoleDisplayName(user.role)}</span>
            </span>
          </div>
        </FormField>
      </div>

      {/* Password Field */}
      <FormFieldWithIcon
        label="New Password"
        htmlFor="password"
        icon={Lock}
        value={formData.password || ''}
        onChange={(password) => onFormDataChange({ ...formData, password })}
        type="password"
        placeholder="Leave blank to keep current password"
        minLength={6}
        helperText={
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Minimum 6 characters. Leave blank if you don't want to change it.</span>
          </div>
        }
      />

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-5 mt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-sm hover:shadow-md"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;

