import { useState, FormEvent } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { SystemConfig } from '@/types';
import { Save, Type, Info } from 'lucide-react';

interface ProjectNameSectionProps {
  config: SystemConfig;
  onUpdate: (config: SystemConfig) => void;
}

const ProjectNameSection = ({ config, onUpdate }: ProjectNameSectionProps) => {
  const [projectName, setProjectName] = useState(config.projectName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    if (projectName.trim() === config.projectName) {
      return; // No changes
    }

    setLoading(true);

    try {
      const updatedConfig = await apiService.updateProjectName({
        projectName: projectName.trim(),
      });
      onUpdate(updatedConfig);
      toast.success('Project name updated successfully!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to update project name';
      setError(errorMessage);
      toast.error('Failed to update project name', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-300">
      {/* Section Header */}
      <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="p-2 sm:p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 transition-colors duration-300 flex-shrink-0">
          <Type className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900 dark:text-white transition-colors duration-300">
            Project Name
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Customize the application name displayed throughout the system
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg transition-colors duration-300">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="input text-sm sm:text-base w-full"
            placeholder="Enter project name"
            required
            disabled={loading}
          />
          <div className="mt-2 flex items-start space-x-2">
            <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              This name will be displayed throughout the application in headers, titles, and branding
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading || projectName.trim() === config.projectName}
            className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto sm:min-w-[160px] justify-center text-sm sm:text-base px-4 py-2.5 sm:py-2.5"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Updating...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectNameSection;

