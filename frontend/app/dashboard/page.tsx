'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Layout/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'user') {
      router.push(
        user.role === 'admin' ? '/admin/dashboard' : '/barber/dashboard'
      );
    }
  }, [user, router]);

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8 neon-text"
          >
            Welcome, {user.name}!
          </motion.h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h3 className="text-xl font-semibold mb-2">Reward Points</h3>
              <p className="text-3xl font-bold text-cyan-400">{user.rewardPoints || 0}</p>
              <p className="text-gray-400 text-sm mt-2">
                100 points = ₹100 discount
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
              <Link href="/gender-select" className="btn-primary w-full text-center block">
                Book Appointment
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-xl font-semibold mb-2">My Appointments</h3>
              <Link href="/appointments" className="btn-secondary w-full text-center block">
                View All
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
