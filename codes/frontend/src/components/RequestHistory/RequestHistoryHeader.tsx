import { RefreshCw } from 'lucide-react';

interface RequestHistoryHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

const RequestHistoryHeader = ({ onRefresh, loading }: RequestHistoryHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
        Request History
      </h1>
      <button
        onClick={onRefresh}
        className="btn btn-secondary flex items-center space-x-2 transition-colors duration-300"
        disabled={loading}
        aria-label="Refresh requests"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        <span>Refresh</span>
      </button>
    </div>
  );
};

export default RequestHistoryHeader;

