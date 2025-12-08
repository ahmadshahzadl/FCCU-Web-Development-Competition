/**
 * User Profile Page
 * 
 * Allows users to view and update their own profile
 * Role-based restrictions apply:
 * - Student/Team: Can only update name and password
 * - Manager: Can update name and password + create users
 * - Admin: Full access (uses UserManagement page)
 */

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { RefreshCw, User as UserIcon, Edit2 } from 'lucide-react';
import type { User, UpdateProfileRequest } from '@/types';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import ProfileForm from '@/components/Profile/ProfileForm';
import AccountInfoCard from '@/components/Profile/AccountInfoCard';
import ManagerCreateUser from '@/components/ManagerCreateUser';

const Profile = () => {
  const { user: currentUser, refreshUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: '',
    password: '',
    email: '',
    username: '',
  });

  useEffect(() => {
    // Initialize with current user from AuthContext immediately
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || '',
        password: '', // Never pre-fill password
        email: currentUser.email || '',
        username: currentUser.username || '',
      });
      setLoading(false);
      
      // Try to refresh from API in the background (non-blocking)
      // This will update the profile if the API call succeeds, but won't break if it fails
      loadProfile().catch(() => {
        // Silently fail - we already have user data from AuthContext
        console.warn('Profile refresh failed, using cached user data');
      });
    } else {
      // If no current user, try to load from API
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      // Don't set loading to true if we already have user data
      if (!user) {
        setLoading(true);
      }
      
      const profileData = await apiService.getProfile();
      setUser(profileData);
      setFormData({
        name: profileData.name || '',
        password: '', // Never pre-fill password
        email: profileData.email || '',
        username: profileData.username || '',
      });
    } catch (error: any) {
      // Handle error gracefully - don't let API client redirect
      // Check if it's a 400 error with "Invalid _id: me" (backend route issue)
      const errorMessage = error.message || '';
      const errorResponse = error.response?.data;
      const isRouteError = 
        errorMessage.includes('Invalid _id') || 
        errorMessage.includes('Invalid id') ||
        errorResponse?.message?.includes('Invalid _id') ||
        errorResponse?.message?.includes('Invalid id') ||
        (error.response?.status === 400 && errorMessage.includes('me'));
      
      if (isRouteError) {
        // Backend route issue - /users/me endpoint not properly configured
        // The backend route /api/users/:id is matching /api/users/me before /api/users/me route
        // Use cached user data and log a warning
        if (currentUser && !user) {
          setUser(currentUser);
          setFormData({
            name: currentUser.name || '',
            password: '',
            email: currentUser.email || '',
            username: currentUser.username || '',
          });
        }
        console.warn(
          'Backend route issue: /api/users/me endpoint not configured properly. ' +
          'The route /api/users/:id is matching before /api/users/me. ' +
          'Using cached user data from AuthContext.'
        );
        // Don't show error toast for route configuration issues - user can still use the page
        return;
      }
      
      // Handle other errors (401, 500, etc.)
      if (currentUser) {
        // Fallback to currentUser if API call fails
        if (!user) {
          setUser(currentUser);
          setFormData({
            name: currentUser.name || '',
            password: '',
            email: currentUser.email || '',
            username: currentUser.username || '',
          });
        }
        console.warn('Failed to load profile from API, using cached user data:', error);
      } else {
        // Only show error if we don't have any user data
        toast.error(error.message || 'Failed to load profile');
        console.error('Error loading profile:', error);
      }
      // Re-throw error so caller knows it failed
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare update data (only include fields that have changed)
      const updateData: UpdateProfileRequest = {};

      // Name can be updated by all roles
      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }

      // Password can be updated by all roles (if provided)
      if (formData.password && formData.password.length >= 6) {
        updateData.password = formData.password;
      } else if (formData.password && formData.password.length > 0) {
        toast.error('Password must be at least 6 characters');
        setSaving(false);
        return;
      }

      // Email and username can only be updated by admin
      if (currentUser?.role === 'admin') {
        if (formData.email && formData.email !== user?.email) {
          updateData.email = formData.email;
        }
        if (formData.username && formData.username !== user?.username) {
          updateData.username = formData.username;
        }
      }

      // Only update if there are changes
      if (Object.keys(updateData).length === 0) {
        toast.success('No changes to save');
        setSaving(false);
        return;
      }

      const updatedUser = await apiService.updateProfile(updateData);
      setUser(updatedUser);
      
      // Update auth context
      await refreshUser();
      
      // Clear password field after successful update
      setFormData((prev) => ({ ...prev, password: '' }));
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      const errorResponse = error.response?.data;
      
      // Handle specific error cases according to documentation
      if (error.response?.status === 400) {
        // Backend validation error
        const backendMessage = errorResponse?.message || errorMessage;
        if (backendMessage.includes('Email and username cannot be changed') || 
            backendMessage.includes('email') || 
            backendMessage.includes('username')) {
          toast.error('Email and username cannot be changed');
        } else {
          toast.error(backendMessage);
        }
      } else if (error.response?.status === 401) {
        // Unauthorized - handled by API client
        toast.error('Session expired. Please sign in again.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Failed to load profile
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
        </div>
        <button
          onClick={loadProfile}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          title="Refresh profile"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Profile Information Card */}
        <div className="xl:col-span-8 space-y-6">
          {/* Profile Header */}
          <ProfileHeader 
            name={user.name || ''} 
            username={user.username} 
            role={user.role} 
          />

          {/* Profile Details Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <span>Profile Information</span>
              </h2>
            </div>

            <ProfileForm
              user={user}
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={handleSubmit}
              saving={saving}
              onCancel={loadProfile}
            />
          </div>

          {/* Manager User Creation Section */}
          {(user.role === 'manager' || user.role === 'admin') && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                User Management
              </h2>
              {user.role === 'manager' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    As a manager, you can create team and student users.
                  </p>
                  <ManagerCreateUser onSuccess={loadProfile} />
                </div>
              )}
              {user.role === 'admin' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    For full user management, visit the User Management page.
                  </p>
                  <a
                    href="/users"
                    className="btn btn-primary inline-flex items-center space-x-2 text-sm py-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Go to User Management</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Info Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          <AccountInfoCard user={user} />
        </div>
      </div>
    </div>
  );
};

export default Profile;

