'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Navbar from '@/components/Layout/Navbar';
import toast from 'react-hot-toast';

export default function BarberDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [barberProfile, setBarberProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'barber') {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      // Check if barber has uploaded certificate
      const profileRes = await api.get('/barbers/profile');
      const barberData = profileRes.data;
      
      setBarberProfile(barberData);

      // If no certificate uploaded, redirect to certificate upload
      if (!barberData.certificate || !barberData.certificate.url) {
        router.push('/barber/certificate-upload');
        return;
      }

      // If certificate is not approved, show pending message
      if (barberData.status !== 'approved') {
        setLoading(false);
        return;
      }

      // Load dashboard data if approved
      const [walletRes, appointmentsRes] = await Promise.all([
        api.get('/wallets'),
        api.get('/appointments'),
      ]);
      setWallet(walletRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error: any) {
      // If barber profile doesn't exist, redirect to certificate upload
      if (error.response?.status === 404) {
        router.push('/barber/certificate-upload');
        return;
      }
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (appointmentId: string) => {
    try {
      await api.put(`/appointments/${appointmentId}/complete`);
      toast.success('Appointment marked as completed');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete appointment');
    }
  };

  if (!user || user.role !== 'barber' || loading) {
    return (
      <div className="min-h-screen bg-dark-50">
        <Navbar />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show pending approval message if certificate is not approved
  if (barberProfile && barberProfile.status !== 'approved') {
    return (
      <div className="min-h-screen bg-dark-50">
        <Navbar />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="card text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2 neon-text">Certificate Under Review</h1>
              <p className="text-gray-400 mb-6">
                Your certificate has been uploaded and is currently under review by our admin team.
              </p>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  <strong>Status:</strong> {barberProfile.status.charAt(0).toUpperCase() + barberProfile.status.slice(1)}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  You will be notified once your certificate is approved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 neon-text">Barber Dashboard</h1>

          {/* Salon Information */}
          {barberProfile?.salonId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-cyan-400">Working at</h3>
                  <p className="text-2xl font-bold text-white">
                    {barberProfile.salonId.name}
                  </p>
                  <p className="text-gray-400 mt-1">
                    {barberProfile.salonId.address?.street}, {barberProfile.salonId.address?.city}
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Salon</p>
                </div>
              </div>
            </motion.div>
          )}

          {wallet && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h3 className="text-xl font-semibold mb-2">Available Balance</h3>
                <p className="text-3xl font-bold text-cyan-400">
                  ₹{wallet.availableBalance || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <h3 className="text-xl font-semibold mb-2">Blocked Commission</h3>
                <p className="text-3xl font-bold text-yellow-400">
                  ₹{wallet.blockedCommission || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h3 className="text-xl font-semibold mb-2">Total Earnings</h3>
                <p className="text-3xl font-bold text-green-400">
                  ₹{wallet.totalEarnings || 0}
                </p>
              </motion.div>
            </div>
          )}

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Today's Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-400">No appointments scheduled</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="p-4 bg-dark-100 rounded-lg border border-dark-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{appointment.hairstyleId?.name}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(appointment.startTime).toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Customer: {appointment.userId?.name}
                        </p>
                      </div>
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleComplete(appointment._id)}
                          className="btn-primary text-sm"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
