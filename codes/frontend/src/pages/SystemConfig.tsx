import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSystemConfig } from '@/contexts/SystemConfigContext';
import { toast } from 'react-hot-toast';
import type { SystemConfig } from '@/types';
import ProjectNameSection from '@/components/SystemConfig/ProjectNameSection';
import LogoSection from '@/components/SystemConfig/LogoSection';
import EmailDomainsSection from '@/components/SystemConfig/EmailDomainsSection';
import { Settings, AlertCircle } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

const SystemConfigPage = () => {
  const { user } = useAuth();
  const { refreshConfig: refreshPublicConfig } = useSystemConfig();
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  usePageTitle('System Configuration');

  useEffect(() => {
    // Only allow admin access
    if (user?.role !== 'admin') {
      setError('Access denied. Admin role required.');
      setLoading(false);
      return;
    }

    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getSystemConfig();
      setConfig(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load system configuration';
      setError(errorMessage);
      toast.error('Failed to load configuration', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async (updatedConfig: SystemConfig) => {
    setConfig(updatedConfig);
    // Refresh public config cache so all users see the update
    await refreshPublicConfig();
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300 font-medium">
              Access denied. Admin role required.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">
            Loading configuration...
          </p>
        </div>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="card bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400">
          <div className="flex items-start space-x-4">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-1">
                Error Loading Configuration
              </h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={loadConfig}
                className="mt-4 btn btn-secondary text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="card text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-2 transition-colors duration-300">
            No configuration found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 transition-colors duration-300">
            Please contact system administrator
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-3">
          <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 transition-colors duration-300">
            <Settings className="h-7 w-7 text-primary-600 dark:text-primary-400 transition-colors duration-300" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              System Configuration
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
              Manage system-wide settings including project name, logo, and email domains
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="space-y-6">
        {/* Project Name Section */}
        <ProjectNameSection config={config} onUpdate={handleConfigUpdate} />

        {/* Logo Section */}
        <LogoSection config={config} onUpdate={handleConfigUpdate} />

        {/* Email Domains Section */}
        <EmailDomainsSection config={config} onUpdate={handleConfigUpdate} />
      </div>
    </div>
  );
};

export default SystemConfigPage;

