/**
 * Email Input with Domain Selection Component
 * 
 * Splits email input into local part (before @) and domain selection
 * from system configuration allowed email domains
 */

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Mail } from 'lucide-react';
import type { SystemConfig } from '@/types';

interface EmailInputWithDomainProps {
  value: string;
  onChange: (email: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
}

const EmailInputWithDomain = ({
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = 'username',
  className = '',
  error,
}: EmailInputWithDomainProps) => {
  const { user } = useAuth();
  const [emailLocal, setEmailLocal] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load allowed email domains (only for admin/manager)
  useEffect(() => {
    const loadDomains = async () => {
      if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
        setLoading(false);
        return;
      }

      try {
        const config: SystemConfig = await apiService.getSystemConfig();
        setAllowedDomains(config.allowedEmailDomains || []);
        
        // If no domains configured, allow free-form email
        if (config.allowedEmailDomains.length === 0) {
          setAllowedDomains([]);
        }
      } catch (error) {
        console.error('Failed to load email domains:', error);
        setAllowedDomains([]);
      } finally {
        setLoading(false);
      }
    };

    loadDomains();
  }, [user]);

  // Parse existing email value (only when domains are configured)
  useEffect(() => {
    if (allowedDomains.length > 0 && value) {
      const atIndex = value.indexOf('@');
      if (atIndex > 0) {
        setEmailLocal(value.substring(0, atIndex));
        const domain = value.substring(atIndex);
        // Check if domain matches any allowed domain
        if (allowedDomains.includes(domain)) {
          setSelectedDomain(domain);
        } else {
          // If domain doesn't match, try to find a close match or use empty
          setSelectedDomain('');
        }
      } else {
        setEmailLocal(value);
        setSelectedDomain('');
      }
    } else if (!value) {
      setEmailLocal('');
      setSelectedDomain('');
    }
  }, [value, allowedDomains]);

  // Update parent when local part or domain changes
  useEffect(() => {
    if (allowedDomains.length > 0) {
      // If domains are configured, require domain selection
      if (emailLocal && selectedDomain) {
        onChange(`${emailLocal}${selectedDomain}`);
      } else {
        onChange('');
      }
    }
    // Note: If no domains configured, we use regular email input (handled in render)
  }, [emailLocal, selectedDomain, allowedDomains, onChange]);

  // If no domains configured or not admin/manager, show regular email input
  if (loading) {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled || loading}
          className={`input pl-10 ${className}`}
          placeholder={placeholder}
        />
      </div>
    );
  }

  if (allowedDomains.length === 0) {
    // Fallback to regular email input if no domains configured
    return (
      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            className={`input pl-10 ${className} ${error ? 'border-red-500' : ''}`}
            placeholder={placeholder}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          No email domains configured. Please configure domains in System Configuration.
        </p>
      </div>
    );
  }

  if (user?.role !== 'admin' && user?.role !== 'manager') {
    // Fallback to regular email input for non-admin/manager users
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={`input pl-10 ${className} ${error ? 'border-red-500' : ''}`}
          placeholder={placeholder}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }

  // Split email input with domain selector
  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={emailLocal}
            onChange={(e) => {
              // Only allow alphanumeric, dots, underscores, and hyphens
              const sanitized = e.target.value.replace(/[^a-zA-Z0-9._-]/g, '');
              setEmailLocal(sanitized);
            }}
            required={required}
            disabled={disabled}
            className={`input pl-10 ${className} ${error ? 'border-red-500' : ''}`}
            placeholder={placeholder}
          />
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400">@</div>
        <div className="flex-1">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            required={required}
            disabled={disabled}
            className={`input ${className} ${error ? 'border-red-500' : ''}`}
          >
            <option value="">Select domain</option>
            {allowedDomains.map((domain, index) => (
              <option key={index} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {allowedDomains.length > 0 && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Select from allowed email domains
        </p>
      )}
    </div>
  );
};

export default EmailInputWithDomain;

