'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import { useAuthStore } from '@/lib/store';
import { useEffect } from 'react';

export default function GenderSelectPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    router.push(`/salons?gender=${gender}`);
  };

  return (
    <div className="min-h-screen bg-dark-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4 neon-text"
          >
            Choose Your Style
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-12"
          >
            Select your gender to see personalized salon options
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenderSelect('male')}
              className="card group cursor-pointer hover:border-cyan-500/50 transition-all"
            >
              <div className="text-8xl mb-4 group-hover:scale-110 transition-transform">
                👨
              </div>
              <h2 className="text-3xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                For Men
              </h2>
              <p className="text-gray-400">
                Haircuts, styling, beard grooming, and more
              </p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenderSelect('female')}
              className="card group cursor-pointer hover:border-cyan-500/50 transition-all"
            >
              <div className="text-8xl mb-4 group-hover:scale-110 transition-transform">
                👩
              </div>
              <h2 className="text-3xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                For Women
              </h2>
              <p className="text-gray-400">
                Haircuts, styling, coloring, facials, and more
              </p>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
