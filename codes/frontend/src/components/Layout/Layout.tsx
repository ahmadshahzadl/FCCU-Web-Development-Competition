import { ReactNode, useState, createContext, useContext } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within Layout');
  }
  return context;
};

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <SidebarContext.Provider value={{ isOpen: isSidebarOpen, toggleSidebar, closeSidebar }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 ease-in-out">
        <Navbar />
        <div className="flex relative">
          <Sidebar />
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors duration-300 ease-in-out min-w-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;

