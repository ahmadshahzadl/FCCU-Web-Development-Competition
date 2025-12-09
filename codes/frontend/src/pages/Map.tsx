import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { CampusMapMarker } from '@/types';
import { MapPin, Loader2, Clock, Mail } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

// Fix for default marker icons - Use CDN URLs
// This prevents 404 errors when loading marker icons
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component to update map bounds when markers change
const MapBoundsUpdater = ({ markers }: { markers: CampusMapMarker[] }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      // Use react-leaflet's useMap hook to get map instance
      // Calculate bounds from marker positions as [number, number][] tuples
      const positions: [number, number][] = markers.map((marker) => [
        marker.latitude,
        marker.longitude,
      ]);
      
      // Use map's fitBounds method with array of coordinate tuples
      if (positions.length > 0) {
        map.fitBounds(positions, { 
          padding: [50, 50], 
          maxZoom: 18 
        });
      }
    }
  }, [markers, map]);

  return null;
};

// Wrapper component to prevent double initialization in React 18 StrictMode
const MapWrapper = ({ 
  center, 
  zoom, 
  markers, 
  onMarkerClick 
}: { 
  center: [number, number];
  zoom: number;
  markers: CampusMapMarker[];
  onMarkerClick: (id: string) => void;
}) => {
  // Generate a unique key on each mount - useState ensures it's created fresh each time
  // This forces React to create a completely new DOM element, preventing Leaflet from seeing an already-initialized container
  const [mapKey] = useState(() => `leaflet-map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  
  return (
    <MapContainer
      key={mapKey}
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers && markers.length > 0 && <MapBoundsUpdater markers={markers} />}

      {(markers || []).map((marker) => (
        <Marker
          key={marker._id}
          position={[marker.latitude, marker.longitude]}
          eventHandlers={{
            click: () => onMarkerClick(marker._id),
          }}
        >
          <Popup className="custom-popup" maxWidth={300}>
            <div className="p-3 min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 transition-colors duration-300">
                {marker.name}
              </h3>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full capitalize mb-2">
                {marker.category}
              </span>
              {marker.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 mb-2 transition-colors duration-300">
                  {marker.description}
                </p>
              )}
              {marker.address && (
                <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
                  <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{marker.address}</span>
                </div>
              )}
              {marker.contactInfo && (
                <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                  <Mail size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{marker.contactInfo}</span>
                </div>
              )}
              {marker.openingHours && (
                <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                  <Clock size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{marker.openingHours}</span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const Map = () => {
  const [markers, setMarkers] = useState<CampusMapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<CampusMapMarker | null>(null);

  usePageTitle('Campus Map');

  // Default center coordinates (adjust to your campus location)
  const defaultCenter: [number, number] = [31.5204, 74.3587];
  const defaultZoom = 15;

  useEffect(() => {
    loadMarkers();
  }, [selectedCategory]);

  const loadMarkers = async () => {
    try {
      setLoading(true);
      const response = selectedCategory
        ? await apiService.getMarkersByCategory(selectedCategory)
        : await apiService.getAllMarkers();

      setMarkers(response?.data || []);

      // Extract unique categories
      const markersData = response?.data || [];
      const uniqueCategories = Array.from(
        new Set(markersData.map((m) => m.category))
      );
      setCategories(uniqueCategories);
    } catch (error: any) {
      console.error('Failed to load markers:', error);
      toast.error('Failed to load campus map markers');
      setMarkers([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = async (markerId: string) => {
    try {
      const response = await apiService.getMarkerById(markerId);
      setSelectedMarker(response.data);
    } catch (error: any) {
      toast.error('Failed to load marker details');
    }
  };

  // Calculate map center and bounds - MUST be called before any conditional returns
  const mapCenter: [number, number] = useMemo(() => {
    if (markers && markers.length > 0) {
      // Calculate center of all markers
      const avgLat = markers.reduce((sum, m) => sum + m.latitude, 0) / markers.length;
      const avgLng = markers.reduce((sum, m) => sum + m.longitude, 0) / markers.length;
      return [avgLat, avgLng];
    }
    return defaultCenter;
  }, [markers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading campus map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header with Filters */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Campus Map
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {(markers || []).length} {(markers || []).length === 1 ? 'location' : 'locations'} found
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapWrapper
          center={mapCenter}
          zoom={defaultZoom}
          markers={markers}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* Marker Details Sidebar */}
      {selectedMarker && (
        <div className="absolute top-20 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 max-w-sm z-[1000] border border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <button
            onClick={() => setSelectedMarker(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="pr-6">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-300">
              {selectedMarker.name}
            </h2>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full capitalize mb-3">
              {selectedMarker.category}
            </span>
            {selectedMarker.description && (
              <p className="text-sm mb-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                {selectedMarker.description}
              </p>
            )}
            <div className="space-y-2">
              {selectedMarker.address && (
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5 text-primary-600 dark:text-primary-400" />
                  <span>{selectedMarker.address}</span>
                </div>
              )}
              {selectedMarker.contactInfo && (
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <Mail size={16} className="flex-shrink-0 mt-0.5 text-primary-600 dark:text-primary-400" />
                  <span>{selectedMarker.contactInfo}</span>
                </div>
              )}
              {selectedMarker.openingHours && (
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <Clock size={16} className="flex-shrink-0 mt-0.5 text-primary-600 dark:text-primary-400" />
                  <span>{selectedMarker.openingHours}</span>
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Coordinates: {selectedMarker.latitude.toFixed(6)}, {selectedMarker.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && (!markers || markers.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 z-10">
          <div className="text-center p-6">
            <MapPin className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No markers found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedCategory ? `No markers found for category "${selectedCategory}"` : 'No campus markers available'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;

