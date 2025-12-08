import { Filter } from 'lucide-react';
import type { RequestStatus, Category } from '@/types';

interface RequestFiltersProps {
  filters: {
    status: '' | RequestStatus;
    category: string;
    page: number;
    limit: number;
  };
  categories: Category[];
  onFilterChange: (filters: Partial<RequestFiltersProps['filters']>) => void;
}

const RequestFilters = ({ filters, categories, onFilterChange }: RequestFiltersProps) => {
  return (
    <div className="card p-4 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status Filter */}
        <div className="flex items-center space-x-2 sm:w-auto w-full">
          <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors duration-300" />
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({ status: e.target.value as '' | RequestStatus })
            }
            className="input h-10 text-sm flex-1 sm:w-auto transition-colors duration-300"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2 sm:w-auto w-full">
          <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors duration-300" />
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="input h-10 text-sm flex-1 sm:w-auto transition-colors duration-300"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default RequestFilters;

