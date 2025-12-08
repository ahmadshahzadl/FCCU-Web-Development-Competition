import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { apiService } from '@/services/api';
import type { PublicSystemConfig } from '@/types';

interface SystemConfigContextType {
  config: PublicSystemConfig | null;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

interface SystemConfigProviderProps {
  children: ReactNode;
}

export const SystemConfigProvider = ({ children }: SystemConfigProviderProps) => {
  const [config, setConfig] = useState<PublicSystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheExpiryRef = useRef<number>(0);
  const cacheDuration = 5 * 60 * 1000; // 5 minutes

  const loadConfig = useCallback(async (useCache = true) => {
    // Return cached config if still valid
    if (useCache && config && Date.now() < cacheExpiryRef.current) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPublicSystemConfig();
      setConfig(data);
      cacheExpiryRef.current = Date.now() + cacheDuration;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load system configuration';
      setError(errorMessage);
      // Set default values on error
      setConfig({
        projectName: 'Campus Helper',
        logoUrl: undefined,
      });
    } finally {
      setLoading(false);
    }
  }, [config, cacheDuration]);

  useEffect(() => {
    loadConfig();
  }, []); // Load once on mount

  const refreshConfig = useCallback(async () => {
    cacheExpiryRef.current = 0; // Clear cache
    await loadConfig(false);
  }, [loadConfig]);

  return (
    <SystemConfigContext.Provider value={{ config, loading, error, refreshConfig }}>
      {children}
    </SystemConfigContext.Provider>
  );
};

export const useSystemConfig = (): SystemConfigContextType => {
  const context = useContext(SystemConfigContext);
  if (!context) {
    throw new Error('useSystemConfig must be used within SystemConfigProvider');
  }
  return context;
};

