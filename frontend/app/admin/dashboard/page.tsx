'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import Navbar from '@/components/Layout/Navbar';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [pendingBarbers, setPendingBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const [statsRes, barbersRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/barbers/pending'),
      ]);
      setStats(statsRes.data);
      setPendingBarbers(barbersRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (barberId: string) => {
    try {
      await api.put(`/admin/barbers/${barberId}/approve`);
      toast.success('Barber approved');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve barber');
    }
  };

  const handleReject = async (barberId: string) => {
    try {
      await api.put(`/admin/barbers/${barberId}/reject`);
      toast.success('Barber rejected');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject barber');
    }
  };

  if (!user || user.role !== 'admin' || loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 neon-text">Admin Dashboard</h1>

          {stats && (
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-cyan-400">{stats.totalUsers}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <h3 className="text-lg font-semibold mb-2">Total Barbers</h3>
                <p className="text-3xl font-bold text-blue-400">{stats.totalBarbers}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-400">₹{stats.totalRevenue}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h3 className="text-lg font-semibold mb-2">Commission</h3>
                <p className="text-3xl font-bold text-yellow-400">₹{stats.totalCommission}</p>
              </motion.div>
            </div>
          )}

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Pending Barber Approvals</h2>
            {pendingBarbers.length === 0 ? (
              <p className="text-gray-400">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingBarbers.map((barber) => (
                  <div
                    key={barber._id}
                    className="p-4 bg-dark-100 rounded-lg border border-dark-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{barber.userId?.name}</p>
                        <p className="text-gray-400 text-sm">{barber.userId?.email}</p>
                        <p className="text-gray-400 text-sm">
                          AI Verification: {barber.certificate?.aiVerification?.status} (
                          {barber.certificate?.aiVerification?.confidence}% confidence)
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(barber._id)}
                          className="btn-primary text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(barber._id)}
                          className="btn-secondary text-sm"
                        >
                          Reject
                        </button>
                      </div>
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
