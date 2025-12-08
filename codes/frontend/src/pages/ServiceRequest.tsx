import { useState } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { RequestCategory, CreateRequestDto } from '@/types';
import { Upload, Send } from 'lucide-react';

const ServiceRequest = () => {
  const [formData, setFormData] = useState<CreateRequestDto>({
    category: 'general',
    description: '',
    studentName: '',
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const categories: { value: RequestCategory; label: string }[] = [
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'academic', label: 'Academic Help' },
    { value: 'lost-found', label: 'Lost & Found' },
    { value: 'general', label: 'General Query' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    setLoading(true);
    try {
      const requestData: CreateRequestDto = {
        ...formData,
        attachment: attachment || undefined,
      };
      
      const request = await apiService.createRequest(requestData);
      toast.success('Request submitted successfully!');
      
      // Reset form
      setFormData({
        category: 'general',
        description: '',
        studentName: '',
      });
      setAttachment(null);
      
      console.log('Request created:', request);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setAttachment(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
        Submit Service Request
      </h1>
      
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
            Category *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as RequestCategory })}
            className="input"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="input"
            placeholder="Please describe your request or issue in detail..."
            required
          />
        </div>

        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
            Your Name (Optional)
          </label>
          <input
            type="text"
            id="studentName"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            className="input"
            placeholder="Enter your name (optional)"
          />
        </div>

        <div>
          <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
            Attachment (Optional)
          </label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="attachment"
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300 bg-white dark:bg-gray-900"
            >
              <Upload className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {attachment ? attachment.name : 'Choose file'}
              </span>
            </label>
            <input
              type="file"
              id="attachment"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
            {attachment && (
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Supported formats: Images, PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
          <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
        </button>
      </form>
    </div>
  );
};

export default ServiceRequest;

