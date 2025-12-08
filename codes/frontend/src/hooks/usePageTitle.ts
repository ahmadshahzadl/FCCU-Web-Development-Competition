import { useEffect } from 'react';
import { useSystemConfig } from '@/contexts/SystemConfigContext';

/**
 * Hook to set page title with project name
 * @param pageTitle - The page title to display
 */
export const usePageTitle = (pageTitle: string): void => {
  const { config } = useSystemConfig();

  useEffect(() => {
    const projectName = config?.projectName || 'Campus Helper';
    document.title = `${pageTitle} - ${projectName}`;

    return () => {
      document.title = projectName;
    };
  }, [pageTitle, config?.projectName]);
};

