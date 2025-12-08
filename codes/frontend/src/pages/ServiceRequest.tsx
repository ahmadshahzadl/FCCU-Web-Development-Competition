import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { CreateRequestDto, Category } from '@/types';
import { Upload, Send, Image as ImageIcon, FileText } from 'lucide-react';

const ServiceRequest = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CreateRequestDto>({
    category: '',
    description: '',
    studentName: '',
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await apiService.getCategories(false); // Only active categories
      setCategories(response);
      if (response.length > 0 && !formData.category) {
        setFormData({ ...formData, category: response[0].slug });
      }
    } catch (error: any) {
      toast.error('Failed to load categories');
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    setLoading(true);
    try {
      const requestData: CreateRequestDto = {
        category: formData.category,
        description: formData.description.trim(),
        attachment: attachment || undefined,
      };
      
      await apiService.createRequest(requestData);
      toast.success('Request submitted successfully!');
      
      // Reset form
      setFormData({
        category: categories.length > 0 ? categories[0].slug : '',
        description: '',
        studentName: '',
      });
      setAttachment(null);
      setPreview(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Failed to submit request';
      toast.error(errorMessage);
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG, PNG, and PDF files are allowed');
        return;
      }

      setAttachment(file);
      setPreview(null);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-8 sm:mb-10">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
            Submit Service Request
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl transition-colors duration-300">
            Fill out the form below to submit your request. Our management team will review and keep you updated on the status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Form - Left Side */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-5">
            {/* Form Header */}
            <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Request Details
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                Please provide all necessary information about your request
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2.5 transition-colors duration-300">
                Category <span className="text-red-500 font-normal">*</span>
              </label>
              {loadingCategories ? (
                <div className="input h-12 flex items-center justify-center transition-colors duration-300 bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading categories...</span>
                </div>
              ) : categories.length === 0 ? (
                <div className="input h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 transition-colors duration-300">
                  <span className="text-sm text-red-600 dark:text-red-400">No categories available</span>
                </div>
              ) : (
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input h-12 text-sm font-medium transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2.5 transition-colors duration-300">
                Description <span className="text-red-500 font-normal">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={7}
                className="input text-sm transition-all duration-300 resize-y focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Please describe your request or issue in detail. Be as specific as possible to help our team assist you better..."
                required
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Provide detailed information about your request for faster processing</span>
              </p>
            </div>

            <div>
              <label htmlFor="attachment" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2.5 transition-colors duration-300">
                Attachment <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
              </label>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <label
                    htmlFor="attachment"
                    className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all duration-300 bg-white dark:bg-gray-900 group"
                  >
                    <Upload className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      {attachment ? attachment.name : 'Choose file to upload'}
                    </span>
                  </label>
                  <input
                    type="file"
                    id="attachment"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                  />
                  {attachment && (
                    <button
                      type="button"
                      onClick={() => {
                        setAttachment(null);
                        setPreview(null);
                      }}
                      className="px-5 py-4 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-500 rounded-xl transition-all duration-300 border-2 border-red-200 dark:border-red-800 hover:border-red-600 dark:hover:border-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {preview && (
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300 uppercase tracking-wide">Image Preview</p>
                    <div className="inline-block p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full sm:max-w-sm rounded-lg"
                      />
                    </div>
                  </div>
                )}
                {attachment && !preview && (
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate transition-colors duration-300">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 transition-colors duration-300">
                        {(attachment.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Supported formats: JPEG, PNG, PDF (Max 5MB)</span>
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading || loadingCategories || categories.length === 0}
                className="w-full btn btn-primary h-12 text-base font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Send className="h-5 w-5" />
                <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Information Sidebar - Right Side */}
        <div className="lg:col-span-5">
          {/* Combined Information Card */}
          <div className="card p-5 space-y-5 sticky top-6">
            {/* How It Works - Compact */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary-600 dark:bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  How It Works
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Submit Request
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 transition-colors duration-300 leading-tight">
                        Fill out the form with details
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Management Reviews
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 transition-colors duration-300 leading-tight">
                        Team reviews your request
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Real-time Updates
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 transition-colors duration-300 leading-tight">
                        Get instant notifications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      4
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Track Progress
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 transition-colors duration-300 leading-tight">
                        Monitor status changes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Status Information - Compact */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Request Status
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50">
                  <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                      Pending
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 transition-colors duration-300">
                      Awaiting review
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50">
                  <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                      In Progress
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 transition-colors duration-300">
                      Team working on it
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50">
                  <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                      Resolved
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 transition-colors duration-300">
                      Successfully completed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Tips - Compact */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Helpful Tips
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                    Provide detailed descriptions for faster resolution
                  </p>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                    Attach photos or documents if relevant
                  </p>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                    Check Request History for updates
                  </p>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                    Receive real-time notifications
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequest;

