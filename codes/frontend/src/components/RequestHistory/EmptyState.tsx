import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="card text-center py-12">
      <Clock className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
      <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
        No requests found
      </p>
      <Link to="/request" className="btn btn-primary">
        Submit Your First Request
      </Link>
    </div>
  );
};

export default EmptyState;

