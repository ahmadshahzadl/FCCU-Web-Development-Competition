import { useState, FormEvent } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { SystemConfig } from '@/types';
import { Plus, Trash2, Mail, Info, CheckCircle2 } from 'lucide-react';

interface EmailDomainsSectionProps {
  config: SystemConfig;
  onUpdate: (config: SystemConfig) => void;
}

const EmailDomainsSection = ({ config, onUpdate }: EmailDomainsSectionProps) => {
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleAddDomain = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newDomain.trim()) {
      setError('Email domain is required');
      return;
    }

    // Ensure domain starts with @
    const domain = newDomain.trim().startsWith('@')
      ? newDomain.trim()
      : `@${newDomain.trim()}`;

    setLoading(true);

    try {
      const updatedConfig = await apiService.addEmailDomain({ domain });
      onUpdate(updatedConfig);
      setNewDomain('');
      toast.success('Email domain added successfully!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to add email domain';
      setError(errorMessage);
      toast.error('Failed to add email domain', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDomain = async (domain: string) => {
    if (!confirm(`Are you sure you want to remove ${domain}?`)) {
      return;
    }

    setLoading(true);

    try {
      const updatedConfig = await apiService.removeEmailDomain({ domain });
      onUpdate(updatedConfig);
      toast.success('Email domain removed successfully!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to remove email domain';
      toast.error(errorMessage, {
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
        <div className="p-2.5 rounded-lg bg-green-100 dark:bg-green-900/30 transition-colors duration-300">
          <Mail className="h-5 w-5 text-green-600 dark:text-green-400 transition-colors duration-300" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white transition-colors duration-300">
            Allowed Email Domains
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Manage email domains allowed for user registration
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg transition-colors duration-300">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300 transition-colors duration-300">
            If no domains are configured, any email address can be used for registration. Adding domains restricts registration to emails from those domains only.
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

      {/* Add Domain Form */}
      <form onSubmit={handleAddDomain} className="mb-6">
        <label className="block text-sm font-semibold mb-2.5 text-gray-700 dark:text-gray-300 transition-colors duration-300">
          Add Email Domain
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="input pl-10"
              placeholder="@example.com"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 min-w-[140px] justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>{loading ? 'Adding...' : 'Add Domain'}</span>
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
          Domain will automatically start with @ if not provided
        </p>
      </form>

      {/* Domains List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Configured Domains ({config.allowedEmailDomains.length})
          </h3>
        </div>
        {config.allowedEmailDomains.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30 transition-colors duration-300">
            <Mail className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 transition-colors duration-300" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">
              No email domains configured
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">
              All email addresses are allowed for registration
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {config.allowedEmailDomains.map((domain, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded bg-green-100 dark:bg-green-900/30 transition-colors duration-300">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 transition-colors duration-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                    {domain}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveDomain(domain)}
                  disabled={loading}
                  className="btn btn-danger flex items-center space-x-2 text-sm px-3 py-1.5 disabled:opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDomainsSection;

