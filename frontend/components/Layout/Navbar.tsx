'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SimpleNotificationBell from '@/components/Notifications';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold neon-text">SalonPro</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={
                    user.role === 'admin'
                      ? '/admin/dashboard'
                      : user.role === 'barber'
                      ? '/barber/dashboard'
                      : '/dashboard'
                  }
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Dashboard
                </Link>
                {user.role === 'user' && (
                  <>
                    <Link
                      href="/style-advisor"
                      className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                      <span>✨</span>
                      Style Advisor
                    </Link>
                    <Link
                      href="/appointments"
                      className="text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      Appointments
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{user.name}</span>
                  {user.rewardPoints && (
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                      {user.rewardPoints} pts
                    </span>
                  )}
                  {/* Show notification bell for barbers */}
                  {user.role === 'barber' && (
                    <SimpleNotificationBell />
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}