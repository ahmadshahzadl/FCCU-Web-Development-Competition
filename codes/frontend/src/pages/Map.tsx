import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { CampusLocation } from '@/types';

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const Map = () => {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Mock data - replace with API call
  useEffect(() => {
    const mockLocations: CampusLocation[] = [
      {
        _id: '1',
        name: 'Main Library',
        type: 'library',
        coordinates: [31.5204, 74.3587],
        description: 'Central library with study spaces and resources',
      },
      {
        _id: '2',
        name: 'Computer Science Building',
        type: 'academic',
        coordinates: [31.5214, 74.3597],
        description: 'Department of Computer Science',
      },
      {
        _id: '3',
        name: 'Student Cafeteria',
        type: 'cafeteria',
        coordinates: [31.5194, 74.3577],
        description: 'Main dining facility',
      },
      {
        _id: '4',
        name: 'Hostel Block A',
        type: 'hostel',
        coordinates: [31.5224, 74.3607],
        description: 'Residential accommodation',
      },
    ];
    setLocations(mockLocations);
  }, []);

  const filteredLocations =
    selectedType === 'all'
      ? locations
      : locations.filter((loc) => loc.type === selectedType);

  const locationTypes = [
    { value: 'all', label: 'All Locations' },
    { value: 'academic', label: 'Academic' },
    { value: 'hostel', label: 'Hostels' },
    { value: 'cafeteria', label: 'Cafeteria' },
    { value: 'library', label: 'Library' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Campus Map</h1>

      <div className="card mb-4">
        <div className="flex flex-wrap gap-2">
          {locationTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === type.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div style={{ height: '600px', width: '100%' }}>
          <MapContainer
            center={[31.5204, 74.3587]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredLocations.map((location) => (
              <Marker key={location._id} position={location.coordinates}>
                <Popup>
                  <div>
                    <h3 className="font-semibold text-lg">{location.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{location.type}</p>
                    {location.description && (
                      <p className="text-sm text-gray-500 mt-1">{location.description}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Map;

