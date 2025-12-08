import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import { RefreshCw, Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/types';
import CategoryCard from '@/components/CategoryManagement/CategoryCard';
import CreateCategoryModal from '@/components/CategoryManagement/CreateCategoryModal';
import EditCategoryModal from '@/components/CategoryManagement/EditCategoryModal';
import DeleteConfirmationModal from '@/components/CategoryManagement/DeleteConfirmationModal';

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    loadCategories();
  }, [includeInactive]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories(includeInactive);
      setCategories(response);
    } catch (error: any) {
      toast.error('Failed to load categories');
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateCategoryData) => {
    try {
      await apiService.createCategory(data);
      toast.success('Category created successfully');
      setShowCreateModal(false);
      loadCategories();
    } catch (error: any) {
      // Extract error message from various error formats
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create category. Please try again.';
      
      // Don't show toast here - let the modal handle the error display
      // But still throw so modal knows there was an error
      throw new Error(errorMessage);
    }
  };

  const handleUpdate = async (id: string, data: UpdateCategoryData) => {
    try {
      await apiService.updateCategory(id, data);
      toast.success('Category updated successfully');
      setEditingCategory(null);
      loadCategories();
    } catch (error: any) {
      // Extract error message from various error formats
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update category. Please try again.';
      
      // Don't show toast here - let the modal handle the error display
      // But still throw so modal knows there was an error
      throw new Error(errorMessage);
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      if (category.isActive) {
        await apiService.deactivateCategory(category._id);
        toast.success('Category deactivated successfully');
      } else {
        await apiService.activateCategory(category._id);
        toast.success('Category activated successfully');
      }
      loadCategories();
    } catch (error: any) {
      // Extract error message from various error formats
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update category status. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteCategory(id);
      toast.success('Category deleted successfully');
      setDeleteConfirm(null);
      loadCategories();
    } catch (error: any) {
      // Extract error message from various error formats
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete category. Please try again.';
      
      // Provide more specific error messages
      if (errorMessage.includes('in use') || errorMessage.includes('active requests')) {
        toast.error('Cannot delete category: It is being used in active requests.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteConfirm({
      id: category._id,
      name: category.name,
    });
  };

  if (loading && categories.length === 0) {
    return (
      <div className="w-full space-y-4 md:space-y-6 px-2 md:px-0">
        <div className="card">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Loading categories...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 md:space-y-6 px-2 md:px-0 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Category Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
            Manage request categories
          </p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={loadCategories}
            className="btn btn-secondary flex items-center space-x-2 text-sm px-3 py-2 flex-1 sm:flex-initial"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center space-x-2 text-sm px-3 py-2 flex-1 sm:flex-initial"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Category</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Include Inactive Toggle */}
      <div className="card p-4 transition-colors duration-300">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
            className="w-4 h-4 text-primary-600 dark:text-primary-400 border-gray-300 dark:border-gray-700 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Include inactive categories
          </span>
        </label>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <p>No categories found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 btn btn-primary text-sm"
            >
              Create First Category
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onEdit={() => setEditingCategory(category)}
              onToggleActive={() => handleToggleActive(category)}
              onDelete={() => handleDeleteClick(category)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateCategoryModal
          isOpen={showCreateModal}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingCategory && (
        <EditCategoryModal
          isOpen={!!editingCategory}
          category={editingCategory}
          onSubmit={(data) => handleUpdate(editingCategory._id, data)}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmationModal
          isOpen={!!deleteConfirm}
          categoryName={deleteConfirm.name}
          onConfirm={() => handleDelete(deleteConfirm.id)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default CategoryManagement;

