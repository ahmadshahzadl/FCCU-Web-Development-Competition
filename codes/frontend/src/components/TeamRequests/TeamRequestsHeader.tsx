import { RefreshCw } from 'lucide-react';

interface TeamRequestsHeaderProps {
  connected: boolean;
  onRefresh: () => void;
}

const TeamRequestsHeader = ({ connected, onRefresh }: TeamRequestsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Requests Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
          View and manage service requests
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Socket Connection Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {connected ? 'Live' : 'Disconnected'}
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="btn btn-secondary flex items-center space-x-2 text-sm px-3 py-2 transition-colors duration-300"
          aria-label="Refresh requests"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default TeamRequestsHeader;

