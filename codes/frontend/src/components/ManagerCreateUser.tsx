/**
 * Manager Create User Component
 * 
 * Allows managers to create team and student users
 * Managers cannot create admin or manager users
 */

import { useState } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import type { CreateUserRequest, UserRole } from '@/types';
import { UserPlus, X, User as UserIcon, Lock, UserCog } from 'lucide-react';
import EmailInputWithDomain from '@/components/Form/EmailInputWithDomain';

interface ManagerCreateUserProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ManagerCreateUser = ({ onSuccess, onCancel }: ManagerCreateUserProps) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    username: '',
    password: '',
    name: '',
    role: 'student',
    studentId: '',
  });

  // Only show for managers and admins
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.email || !formData.username || !formData.password) {
        toast.error('Email, username, and password are required');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (formData.username.length < 3) {
        toast.error('Username must be at least 3 characters');
        setLoading(false);
        return;
      }

      // Managers can only create team and student users
      if (user.role === 'manager' && !['team', 'student'].includes(formData.role)) {
        toast.error('Managers can only create team and student users');
        setLoading(false);
        return;
      }

      await apiService.createUser(formData);
      toast.success('User created successfully');
      
      // Reset form
      setFormData({
        email: '',
        username: '',
        password: '',
        name: '',
        role: 'student',
        studentId: '',
      });
      
      setShowModal(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create user';
      
      // Handle specific error cases
      if (errorMessage.includes('email') || errorMessage.includes('username')) {
        toast.error('Email or username already exists');
      } else if (errorMessage.includes('admin') || errorMessage.includes('manager')) {
        toast.error('Managers can only create team and student users');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary flex items-center space-x-2 w-full"
      >
        <UserPlus className="h-4 w-4" />
        <span>Create New User</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create New User
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      email: '',
                      username: '',
                      password: '',
                      name: '',
                      role: 'student',
                      studentId: '',
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {user.role === 'manager' && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center space-x-2">
                    <UserCog className="h-4 w-4" />
                    <span>You can create team and student users only.</span>
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <EmailInputWithDomain
                    value={formData.email}
                    onChange={(email) => setFormData({ ...formData, email })}
                    required
                    placeholder="username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      required
                      minLength={3}
                      value={formData.username}
                      onChange={handleChange}
                      className="input pl-10 w-full"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      className="input pl-10 w-full"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    disabled={user.role === 'manager'}
                    className="input w-full"
                  >
                    {user.role === 'admin' && (
                      <>
                        <option value="student">Student</option>
                        <option value="team">Team</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </>
                    )}
                    {user.role === 'manager' && (
                      <>
                        <option value="student">Student</option>
                        <option value="team">Team</option>
                      </>
                    )}
                  </select>
                  {user.role === 'manager' && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Managers can only create team and student users
                    </p>
                  )}
                </div>

                {formData.role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="STU-2024-001"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({
                        email: '',
                        username: '',
                        password: '',
                        name: '',
                        role: 'student',
                        studentId: '',
                      });
                      if (onCancel) onCancel();
                    }}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{loading ? 'Creating...' : 'Create User'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerCreateUser;


