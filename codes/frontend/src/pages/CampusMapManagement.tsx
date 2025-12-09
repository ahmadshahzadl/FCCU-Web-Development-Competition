import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import type { CampusMapMarker, CreateMarkerRequest, UpdateMarkerRequest } from '@/types';
import CreateMarkerModal from '@/components/CampusMap/CreateMarkerModal';
import DeleteMarkerModal from '@/components/CampusMap/DeleteMarkerModal';
import { Plus, Edit, Trash2, MapPin, Loader2, BarChart3 } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

const CampusMapManagement = () => {
  const { user } = useAuth();
  const [markers, setMarkers] = useState<CampusMapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMarker, setEditingMarker] = useState<CampusMapMarker | null>(null);
  const [deleteMarker, setDeleteMarker] = useState<CampusMapMarker | null>(null);
  const [statistics, setStatistics] = useState<{
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
    uniqueCategories: string[];
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  usePageTitle('Campus Map Management');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadMarkers();
      loadStatistics();
    }
  }, [user?.role, selectedCategory]);

  const loadMarkers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllMarkersAdmin(selectedCategory || undefined);
      setMarkers(response?.data || []);
    } catch (error: any) {
      toast.error('Failed to load markers');
      console.error('Error loading markers:', error);
      setMarkers([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await apiService.getMarkerStatistics();
      setStatistics(response.data);
    } catch (error: any) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleCreate = async (data: CreateMarkerRequest | UpdateMarkerRequest) => {
    try {
      await apiService.createMarker(data as CreateMarkerRequest);
      toast.success('Marker created successfully');
      setShowCreateModal(false);
      loadMarkers();
      loadStatistics();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create marker. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleUpdate = async (data: CreateMarkerRequest | UpdateMarkerRequest) => {
    if (!editingMarker) return;

    try {
      await apiService.updateMarker(editingMarker._id, data as UpdateMarkerRequest);
      toast.success('Marker updated successfully');
      setEditingMarker(null);
      loadMarkers();
      loadStatistics();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update marker. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteMarker) return;

    try {
      await apiService.deleteMarker(deleteMarker._id);
      toast.success('Marker deleted successfully');
      setDeleteMarker(null);
      loadMarkers();
      loadStatistics();
    } catch (error: any) {
      toast.error('Failed to delete marker');
      console.error('Error deleting marker:', error);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="w-full space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 transition-colors duration-300">
        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50">
          <div className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-yellow-800 dark:text-yellow-400">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 transition-colors duration-300">
        <div className="card">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading markers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = statistics?.uniqueCategories || [];

  return (
    <div className="w-full space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Campus Map Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
            Manage campus map markers and locations
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMarker(null);
            setShowCreateModal(true);
          }}
          className="btn btn-primary flex items-center space-x-2 text-xs sm:text-sm px-3 sm:px-4 py-2 w-full sm:w-auto min-w-0 touch-manipulation"
        >
          <Plus className="h-4 w-4 flex-shrink-0" />
          <span>Add Marker</span>
        </button>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="card p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Total Markers
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 transition-colors duration-300">
                  {statistics.total}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            </div>
          </div>
          <div className="card p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Active
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-1 transition-colors duration-300">
                  {statistics.active}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
            </div>
          </div>
          <div className="card p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Inactive
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                  {statistics.inactive}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            </div>
          </div>
          <div className="card p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Categories
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 transition-colors duration-300">
                  {categories.length}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {categories.length > 0 && (
        <div className="card p-3 sm:p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors duration-300 ${
                selectedCategory === ''
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-600 dark:bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} ({statistics?.byCategory[category] || 0})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Markers List */}
      {(!markers || markers.length === 0) ? (
        <div className="card p-6 sm:p-8 text-center">
          <MapPin className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium mb-2 transition-colors duration-300">
            No markers found
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-4 transition-colors duration-300">
            {selectedCategory ? `No markers found for category "${selectedCategory}"` : 'Get started by creating your first marker'}
          </p>
          {!selectedCategory && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary text-xs sm:text-sm px-4 py-2 touch-manipulation"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Create First Marker
            </button>
          )}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {(markers || []).map((marker) => (
                  <tr
                    key={marker._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors duration-300"
                  >
                    <td className="px-4 py-3 text-xs sm:text-sm text-gray-900 dark:text-white transition-colors duration-300">
                      {marker.name}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize transition-colors duration-300">
                      {marker.category}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          marker.isActive
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                        } transition-colors duration-300`}
                      >
                        {marker.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingMarker(marker);
                            setShowCreateModal(true);
                          }}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteMarker(marker)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateMarkerModal
        isOpen={showCreateModal}
        editingMarker={editingMarker || undefined}
        onSubmit={editingMarker ? handleUpdate : handleCreate}
        onClose={() => {
          setShowCreateModal(false);
          setEditingMarker(null);
        }}
      />

      <DeleteMarkerModal
        isOpen={!!deleteMarker}
        markerName={deleteMarker?.name || ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteMarker(null)}
      />
    </div>
  );
};

export default CampusMapManagement;

