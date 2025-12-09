import { ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';

const Chat = () => {
  usePageTitle('Chat Support');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Link 
          to="/history" 
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Chat Support
        </h1>
      </div>

      <div className="card">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-6">
            <Construction className="h-24 w-24 text-gray-400 dark:text-gray-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
            Page Under Construction
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6 transition-colors duration-300">
            We're working hard to bring you an amazing chat support experience. This feature will be available soon!
          </p>
          <Link
            to="/history"
            className="btn btn-primary"
          >
            Back to Request History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Chat;

