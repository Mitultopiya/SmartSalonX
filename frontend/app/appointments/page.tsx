'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Layout/Navbar';
import toast from 'react-hot-toast';

interface Appointment {
  _id: string;
  salonId: { name: string; address: any };
  barberId: { userId: { name: string } };
  hairstyleId: { name: string; price: number };
  startTime: string;
  endTime: string;
  status: string;
  finalAmount: number;
  review?: { rating: number; comment: string };
}

export default function AppointmentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchAppointments();
  }, [user, router]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.put(`/appointments/${appointmentId}/cancel`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'completed':
        return 'text-blue-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
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

  return (
    <div className="min-h-screen bg-dark-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 neon-text">My Appointments</h1>

          {appointments.length === 0 ? (
            <div className="card text-center">
              <p className="text-gray-400 mb-4">No appointments found</p>
              <button
                onClick={() => router.push('/gender-select')}
                className="btn-primary"
              >
                Book Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {appointment.salonId.name}
                      </h3>
                      <p className="text-gray-400 mb-1">
                        Barber: {appointment.barberId.userId.name}
                      </p>
                      <p className="text-gray-400 mb-1">
                        Service: {appointment.hairstyleId.name}
                      </p>
                      <p className="text-gray-400 mb-1">
                        Date: {new Date(appointment.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 mb-2">
                        Time: {new Date(appointment.startTime).toLocaleTimeString()} -{' '}
                        {new Date(appointment.endTime).toLocaleTimeString()}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className={`font-semibold ${getStatusColor(appointment.status)}`}>
                          {appointment.status.toUpperCase()}
                        </span>
                        <span className="text-cyan-400 font-semibold">
                          ₹{appointment.finalAmount}
                        </span>
                      </div>
                      {appointment.review && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">⭐</span>
                            <span>{appointment.review.rating}</span>
                          </div>
                          <p className="text-gray-400 text-sm">{appointment.review.comment}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="btn-secondary text-sm"
                        >
                          Cancel
                        </button>
                      )}
                      {appointment.status === 'completed' && !appointment.review && (
                        <button
                          onClick={() => router.push(`/appointments/${appointment._id}/review`)}
                          className="btn-primary text-sm"
                        >
                          Add Review
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
