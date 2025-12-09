/**
 * System Prompt Manager Component
 * 
 * Admin-only component for managing AI system prompt
 */

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Save, Loader2, RefreshCw } from 'lucide-react';

const SystemPromptManager = () => {
  const { user } = useAuth();
  const [systemPrompt, setSystemPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadSystemPrompt();
    }
  }, [user?.role]);

  const loadSystemPrompt = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSystemPrompt();
      setSystemPrompt(response.data.systemPrompt);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load system prompt';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!systemPrompt.trim()) {
      toast.error('System prompt cannot be empty');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await apiService.updateSystemPrompt(systemPrompt.trim());
      toast.success('System prompt updated successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update system prompt';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="w-full space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 transition-colors duration-300">
        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50">
          <div className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-yellow-800 dark:text-yellow-400">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 transition-colors duration-300">
        <div className="card">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading system prompt...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            AI System Prompt Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
            Configure the system prompt that defines how the AI assistant behaves and responds to users
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="card p-3 sm:p-4 md:p-6 transition-colors duration-300">
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-sm sm:text-base text-red-800 dark:text-red-400 transition-colors duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-semibold mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">
              System Prompt
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={15}
              className="input w-full font-mono text-xs sm:text-sm transition-colors duration-300"
              placeholder="Enter the system prompt that defines the AI assistant's behavior..."
              disabled={saving}
            />
            <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              This prompt will be used to configure the AI assistant's personality, knowledge, and response style.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center justify-center space-x-2 text-xs sm:text-sm px-3 sm:px-4 py-2 w-full sm:w-auto min-w-0 disabled:opacity-50 touch-manipulation"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 flex-shrink-0" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={loadSystemPrompt}
              disabled={saving || loading}
              className="btn btn-secondary flex items-center justify-center space-x-2 text-xs sm:text-sm px-3 sm:px-4 py-2 w-full sm:w-auto min-w-0 disabled:opacity-50 touch-manipulation"
            >
              <RefreshCw className="h-4 w-4 flex-shrink-0" />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemPromptManager;

