'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Navbar from '@/components/Layout/Navbar';
import { MapContainer } from '@/components/Salon/MapContainer';
import Link from 'next/link';

interface Salon {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  rating: { average: number; count: number };
  genderServices: string[];
}

export default function SalonsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gender = searchParams.get('gender') || 'male';
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Mumbai if geolocation fails
          setUserLocation({ lat: 19.076, lng: 72.8777 });
        }
      );
    } else {
      setUserLocation({ lat: 19.076, lng: 72.8777 });
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchSalons();
    }
  }, [userLocation, gender]);

  const fetchSalons = async () => {
    if (!userLocation) return;

    try {
      const response = await api.get('/salons/nearby', {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          gender,
          maxDistance: 50,
        },
      });
      setSalons(response.data);
    } catch (error) {
      console.error('Error fetching salons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading salons...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8 neon-text"
          >
            Nearby Salons
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Salon List */}
            <div className="lg:col-span-1 space-y-4">
              {salons.length === 0 ? (
                <div className="card text-center">
                  <p className="text-gray-400">No salons found nearby</p>
                </div>
              ) : (
                salons.map((salon, index) => (
                  <motion.div
                    key={salon._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/salons/${salon._id}?gender=${gender}`}>
                      <div className="card hover:border-cyan-500/50 cursor-pointer transition-all">
                        <h3 className="text-xl font-semibold mb-2">{salon.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {salon.address.street}, {salon.address.city}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-sm">
                              {salon.rating.average.toFixed(1)} ({salon.rating.count})
                            </span>
                          </div>
                          <span className="text-cyan-400 text-sm">View Details →</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <div className="card p-0 overflow-hidden">
                <MapContainer salons={salons} userLocation={userLocation} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
