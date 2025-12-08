import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { SystemConfig } from '@/types';
import { Upload, Trash2, Save, Image as ImageIcon, Info, X } from 'lucide-react';

interface LogoSectionProps {
  config: SystemConfig;
  onUpdate: (config: SystemConfig) => void;
}

const LogoSection = ({ config, onUpdate }: LogoSectionProps) => {
  const [logo, setLogo] = useState<string | null>(config.logoUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/svg+xml',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Supported formats: PNG, JPG, JPEG, GIF, SVG, WEBP');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    setError('');

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setLogo(base64String);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!logo) {
      setError('Please select a logo image');
      return;
    }

    if (logo === config.logoUrl) {
      return; // No changes
    }

    setLoading(true);

    try {
      const updatedConfig = await apiService.updateLogo({ logo });
      onUpdate(updatedConfig);
      toast.success('Logo updated successfully!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update logo';
      setError(errorMessage);
      toast.error('Failed to update logo', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!confirm('Are you sure you want to remove the logo?')) {
      return;
    }

    setLoading(true);

    try {
      const updatedConfig = await apiService.updateLogo({ logo: '' });
      onUpdate(updatedConfig);
      setLogo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Logo removed successfully!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err: any) {
      toast.error('Failed to remove logo', {
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
      <div className="flex items-start space-x-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 transition-colors duration-300">
          <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white transition-colors duration-300">
            System Logo
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Upload and manage the system logo displayed in headers and branding
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

      {/* Current Logo Preview */}
      {config.logoUrl && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Current Logo
          </p>
          <div className="flex items-center space-x-4">
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
              <img
                src={config.logoUrl}
                alt="Current logo"
                className="max-h-24 max-w-48 object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-semibold mb-2.5 text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Upload Logo
          </label>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="logo-upload"
              disabled={loading}
            />
            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 bg-gray-50 dark:bg-gray-800/50 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 mb-2 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  <span className="text-primary-600 dark:text-primary-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  PNG, JPG, JPEG, GIF, SVG, WEBP (Max 2MB)
                </p>
              </div>
            </label>
          </div>
          <div className="mt-2 flex items-start space-x-2">
            <Info className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Recommended size: 200x50px or similar aspect ratio. Logo will be displayed in the application header.
            </p>
          </div>
        </div>

        {/* Preview New Logo */}
        {logo && logo !== config.logoUrl && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 transition-colors duration-300">
                Preview
              </p>
              <button
                type="button"
                onClick={() => {
                  setLogo(config.logoUrl || null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-300"
              >
                <X className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
            <div className="border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 bg-white dark:bg-gray-900 inline-block transition-colors duration-300">
              <img
                src={logo}
                alt="Logo preview"
                className="max-h-24 max-w-48 object-contain"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !logo || logo === config.logoUrl}
            className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Updating...' : 'Save Logo'}</span>
          </button>

          {config.logoUrl && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              disabled={loading}
              className="btn btn-danger flex items-center space-x-2 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LogoSection;

