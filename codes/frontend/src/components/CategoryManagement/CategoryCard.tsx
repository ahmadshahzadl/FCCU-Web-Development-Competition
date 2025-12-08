import { Edit, Trash2, Power, PowerOff, Hash } from 'lucide-react';
import type { Category } from '@/types';
import { formatDate } from '@/utils/helpers';

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

const CategoryCard = ({ category, onEdit, onToggleActive, onDelete }: CategoryCardProps) => {
  return (
    <div
      className={`card p-4 transition-all duration-300 ${
        !category.isActive ? 'opacity-60' : ''
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors duration-300 truncate">
            {category.name}
          </h3>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <Hash className="h-3 w-3" />
            <span className="font-mono">{category.slug}</span>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 transition-colors duration-300 ${
            category.isActive
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
          }`}
        >
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Description */}
      {category.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 transition-colors duration-300">
          {category.description}
        </p>
      )}

      {/* Dates */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 space-y-1 transition-colors duration-300">
        <p>Created: {formatDate(category.createdAt)}</p>
        {category.updatedAt !== category.createdAt && (
          <p>Updated: {formatDate(category.updatedAt)}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-all duration-200"
          title="Edit category"
        >
          <Edit className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>
        <button
          onClick={onToggleActive}
          className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
            category.isActive
              ? 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
              : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
          title={category.isActive ? 'Deactivate category' : 'Activate category'}
        >
          {category.isActive ? (
            <>
              <PowerOff className="h-3.5 w-3.5" />
              <span>Deactivate</span>
            </>
          ) : (
            <>
              <Power className="h-3.5 w-3.5" />
              <span>Activate</span>
            </>
          )}
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200"
          title="Delete category"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;

