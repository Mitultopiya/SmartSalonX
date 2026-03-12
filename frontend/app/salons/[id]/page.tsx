'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Navbar from '@/components/Layout/Navbar';
import toast from 'react-hot-toast';

interface Barber {
  _id: string;
  userId: { name: string };
  specialization: string[];
  rating: { average: number; count: number };
  workingHours: any;
}

interface Hairstyle {
  _id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface Salon {
  _id: string;
  name: string;
  address: any;
  rating: { average: number; count: number };
  barbers: Barber[];
}

export default function SalonDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const gender = searchParams.get('gender') || 'male';
  const [salon, setSalon] = useState<Salon | null>(null);
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalonDetails();
    fetchHairstyles();
  }, [params.id, gender]);

  const fetchSalonDetails = async () => {
    try {
      const response = await api.get(`/salons/${params.id}`);
      setSalon(response.data);
    } catch (error) {
      toast.error('Failed to load salon details');
    } finally {
      setLoading(false);
    }
  };

  const fetchHairstyles = async () => {
    try {
      const response = await api.get('/hairstyles', {
        params: { gender, isActive: true },
      });
      setHairstyles(response.data);
    } catch (error) {
      console.error('Error fetching hairstyles:', error);
    }
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleBook = () => {
    if (!selectedBarber || selectedServices.length === 0) {
      toast.error('Please select a barber and at least one service');
      return;
    }
    const servicesParam = selectedServices.join(',');
    router.push(
      `/booking?salonId=${params.id}&barberId=${selectedBarber}&services=${servicesParam}&gender=${gender}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-dark-50">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-gray-400">Salon not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 neon-text">{salon.name}</h1>
            <p className="text-gray-400 mb-4">
              {salon.address.street}, {salon.address.city}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">⭐</span>
                <span>{salon.rating.average.toFixed(1)}</span>
                <span className="text-gray-400">({salon.rating.count} reviews)</span>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Barbers */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Barber</h2>
              <div className="space-y-4">
                {salon.barbers && salon.barbers.length > 0 ? (
                  salon.barbers.map((barber) => (
                    <motion.div
                      key={barber._id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedBarber(barber._id)}
                      className={`card cursor-pointer ${
                        selectedBarber === barber._id
                          ? 'border-cyan-500 border-2'
                          : 'hover:border-cyan-500/50'
                      }`}
                    >
                      <h3 className="text-xl font-semibold mb-2">
                        {barber.userId.name}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span>{barber.rating.average.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {barber.specialization.join(', ')}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400">No barbers available</p>
                )}
              </div>
            </div>

            {/* Services (multi-select) */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Services</h2>
              <div className="space-y-4">
                {hairstyles.map((hairstyle) => (
                  <motion.div
                    key={hairstyle._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleService(hairstyle._id)}
                    className={`card cursor-pointer ${
                      selectedServices.includes(hairstyle._id)
                        ? 'border-cyan-500 border-2'
                        : 'hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{hairstyle.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{hairstyle.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>⏱️ {hairstyle.duration} min</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-cyan-400">
                        ₹{hairstyle.price}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleBook}
          disabled={!selectedBarber || selectedServices.length === 0}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
