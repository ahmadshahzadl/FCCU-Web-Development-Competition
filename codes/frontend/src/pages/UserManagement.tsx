/**
 * User Management Page
 * 
 * Admin/Manager page for managing users
 * Features: View all users, search, filter by role, create, update, delete users
 */

import { useState, useEffect, useMemo } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { RefreshCw, UserPlus } from 'lucide-react';
import type { User, UserRole, CreateUserRequest, UpdateUserRequest } from '@/types';
import UserStatsCards from '@/components/UserManagement/UserStatsCards';
import UserFilters from '@/components/UserManagement/UserFilters';
import UserTable from '@/components/UserManagement/UserTable';
import UserDetailsModal from '@/components/UserManagement/UserDetailsModal';
import UserCreateEditModal from '@/components/UserManagement/UserCreateEditModal';
import DeleteConfirmationModal from '@/components/UserManagement/DeleteConfirmationModal';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  
  // Check if current user is admin (full access) or manager (limited access)
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';

  // Form state for create/edit
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    username: '',
    password: '',
    name: '',
    role: 'student',
    studentId: '',
  });

  useEffect(() => {
    // Debounce search query
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedRole, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedRole !== 'all') {
        params.role = selectedRole;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      const data = await apiService.getUsers(params);
      setUsers(data);
    } catch (error: any) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use users directly since filtering is done by API
  const filteredUsers = users;

  // Calculate statistics
  const stats = useMemo(() => {
    // For managers, exclude admins from total and don't show admin count
    const byRole = {
      admin: filteredUsers.filter((u) => u.role === 'admin').length,
      manager: filteredUsers.filter((u) => u.role === 'manager').length,
      team: filteredUsers.filter((u) => u.role === 'team').length,
      student: filteredUsers.filter((u) => u.role === 'student').length,
    };
    
    // Total for managers: managers + students + team (exclude admins)
    // Total for admins: all users
    const total = isManager 
      ? byRole.manager + byRole.student + byRole.team
      : filteredUsers.length;
    
    return { total, byRole };
  }, [filteredUsers, isManager]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Managers can only create team and student users
      if (isManager && !['team', 'student'].includes(formData.role)) {
        toast.error('Managers can only create team and student users');
        return;
      }
      
      await apiService.createUser(formData);
      toast.success('User created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create user';
      
      // Handle specific error cases
      if (errorMessage.includes('admin') || errorMessage.includes('manager')) {
        toast.error('Managers can only create team and student users');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const updateData: UpdateUserRequest = {
        email: formData.email,
        username: formData.username,
        name: formData.name,
        role: formData.role,
        studentId: formData.studentId,
      };
      await apiService.updateUser(editingUser.id, updateData);
      toast.success('User updated successfully');
      setShowCreateModal(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm) return;
    try {
      await apiService.deleteUser(deleteConfirm.id);
      toast.success('User deleted successfully');
      setDeleteConfirm(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      username: user.username,
      password: '', // Don't pre-fill password
      name: user.name || '',
      role: user.role,
      studentId: user.studentId || '',
    });
    setShowCreateModal(true);
  };

  const handleViewClick = (user: User) => {
    setViewingUser(user);
  };

  const handleDeleteClick = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setDeleteConfirm({
      id: userId,
      name: user?.name || user?.username || 'this user'
    });
  };

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
      password: '',
      name: '',
      role: 'student',
      studentId: '',
    });
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 px-2 md:px-0 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={fetchUsers}
            className="btn btn-secondary flex items-center space-x-2 text-sm px-3 py-2 flex-1 sm:flex-initial"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingUser(null);
              setShowCreateModal(true);
            }}
            className="btn btn-primary flex items-center space-x-2 text-sm px-3 py-2 flex-1 sm:flex-initial"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <UserStatsCards stats={stats} isManager={isManager} />

      {/* Filters and Search */}
      <UserFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        loading={loading}
        onView={handleViewClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* User Details Modal */}
      {viewingUser && (
        <UserDetailsModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}

      {/* Create/Edit Modal */}
      <UserCreateEditModal
        isOpen={showCreateModal}
        editingUser={editingUser}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        onClose={() => {
          setShowCreateModal(false);
          setEditingUser(null);
          resetForm();
        }}
        isManager={isManager}
        isAdmin={isAdmin}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteConfirm}
        userName={deleteConfirm?.name || ''}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};

export default UserManagement;

