'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';

// react-leaflet must be dynamically imported in Next.js (client-only)
const MapContainerLeaflet = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), {
  ssr: false,
});

interface Salon {
  _id: string;
  name: string;
  address: {
    coordinates: { lat: number; lng: number };
    street?: string;
    city?: string;
  };
  rating?: {
    average: number;
    count: number;
  };
}

interface MapContainerProps {
  salons: Salon[];
  userLocation: { lat: number; lng: number } | null;
}

const defaultCenter = { lat: 19.076, lng: 72.8777 }; // Default to Mumbai

export function MapContainer({ salons, userLocation }: MapContainerProps) {
  const [isReady, setIsReady] = useState(false);

  // Fix Leaflet default marker icons in bundlers like Next.js
  useEffect(() => {
    // Only run client-side
    if (typeof window === 'undefined') return;
    try {
      const iconRetinaUrl = new URL(
        'leaflet/dist/images/marker-icon-2x.png',
        import.meta.url
      ).toString();
      const iconUrl = new URL(
        'leaflet/dist/images/marker-icon.png',
        import.meta.url
      ).toString();
      const shadowUrl = new URL(
        'leaflet/dist/images/marker-shadow.png',
        import.meta.url
      ).toString();
      L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });
    } catch {
      // noop: worst case markers render without icons (rare)
    }
    setIsReady(true);
  }, []);

  const center: LatLngExpression = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (salons.length > 0) {
      return [salons[0].address.coordinates.lat, salons[0].address.coordinates.lng];
    }
    return [defaultCenter.lat, defaultCenter.lng];
  }, [salons, userLocation]);

  if (!isReady) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-dark-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full">
      <MapContainerLeaflet
        center={center}
        zoom={salons.length === 0 && !userLocation ? 5 : 12}
        style={{ height: '600px', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">You</div>
                <div className="text-gray-600">
                  {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {salons.map((salon) => (
          <Marker
            key={salon._id}
            position={[salon.address.coordinates.lat, salon.address.coordinates.lng]}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{salon.name}</div>
                {(salon.address.street || salon.address.city) && (
                  <div className="text-gray-600">
                    {salon.address.street ? `${salon.address.street}, ` : ''}
                    {salon.address.city || ''}
                  </div>
                )}
                {salon.rating && (
                  <div className="mt-1 text-gray-700">
                    ⭐ {salon.rating.average.toFixed(1)} ({salon.rating.count})
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainerLeaflet>
    </div>
  );
}
