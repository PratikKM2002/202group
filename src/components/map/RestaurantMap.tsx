import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '../../types';
import { Link } from 'react-router-dom';

// Fix Leaflet icon paths
import L from 'leaflet';

// Fix Leaflet's default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RestaurantMapProps {
  restaurant?: Restaurant;
  restaurants?: Restaurant[];
  height?: string;
  zoom?: number;
  className?: string;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({
  restaurant,
  restaurants,
  height = '400px',
  zoom = 13,
  className = '',
}) => {
  // If neither a single restaurant nor a list is provided, return null
  if (!restaurant && (!restaurants || restaurants.length === 0)) {
    return null;
  }

  let center: [number, number];
  let markersData: Restaurant[];
  
  if (restaurant) {
    // Single restaurant view
    center = [restaurant.address.latitude, restaurant.address.longitude];
    markersData = [restaurant];
  } else if (restaurants && restaurants.length > 0) {
    // Multiple restaurants view
    // Calculate the center based on the average of all coordinates
    const totalLat = restaurants.reduce((sum, r) => sum + r.address.latitude, 0);
    const totalLng = restaurants.reduce((sum, r) => sum + r.address.longitude, 0);
    center = [totalLat / restaurants.length, totalLng / restaurants.length];
    markersData = restaurants;
  } else {
    // Default center (San Francisco)
    center = [37.7749, -122.4194];
    markersData = [];
  }

  return (
    <div style={{ height }} className={className}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {markersData.map((r) => (
          <Marker key={r.id} position={[r.address.latitude, r.address.longitude]}>
            <Popup>
              <div className="text-center">
                <h3 className="font-medium text-primary-700">{r.name}</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {r.address.street}, {r.address.city}
                </p>
                <div className="mt-2">
                  <Link 
                    to={`/restaurants/${r.id}`}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RestaurantMap;