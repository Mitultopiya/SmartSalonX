'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Layout/Navbar';

const VantaBackground = dynamic(() => import('@/components/Animations/VantaBackground'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <VantaBackground />
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 neon-text"
            >
              Smart Salon & Parlour
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              Book your perfect look with ease. Discover nearby salons, choose your barber,
              and schedule appointments in minutes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/gender-select" className="btn-primary text-lg px-8 py-4">
                Get Started
              </Link>
              <Link href="/login" className="btn-secondary text-lg px-8 py-4">
                Login
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 neon-text">
              Why Choose Us?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const features = [
  {
    icon: '📍',
    title: 'Find Nearby Salons',
    description: 'Discover salons near you with our interactive map',
  },
  {
    icon: '✂️',
    title: 'Expert Barbers',
    description: 'Choose from verified and experienced barbers',
  },
  {
    icon: '💳',
    title: 'Easy Payments',
    description: 'Secure online payments with instant confirmations',
  },
  {
    icon: '⭐',
    title: 'Reward Points',
    description: 'Earn points with every booking and get discounts',
  },
  {
    icon: '📅',
    title: 'Smart Scheduling',
    description: 'Real-time availability with collision-free booking',
  },
  {
    icon: '🔒',
    title: 'Secure & Safe',
    description: 'Your data and payments are completely secure',
  },
];
