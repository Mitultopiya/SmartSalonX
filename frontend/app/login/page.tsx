'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import Navbar from '@/components/Layout/Navbar';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      
      // Check login mode and role before setting auth
      if (showAdminLogin) {
        // User clicked Admin Login button - only allow admin role
        if (response.data.user.role === 'admin') {
          setAuth(response.data.user, response.data.token);
          toast.success('Admin login successful!');
          router.push('/admin/dashboard');
        } else {
          toast.error('Invalid credentials for admin login');
        }
      } else {
        // Regular user login - only allow user and barber roles
        if (response.data.user.role === 'admin') {
          toast.error('Please use Admin Login button for admin access');
        } else {
          setAuth(response.data.user, response.data.token);
          toast.success('Login successful!');
          
          if (response.data.user.role === 'barber') {
            router.push('/barber/dashboard'); // This will redirect to certificate upload if needed
          } else if (response.data.user.role === 'user') {
            router.push('/gender-select');
          }
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card">
            <h1 className="text-3xl font-bold mb-2 neon-text text-center">
              {showAdminLogin ? 'Admin Login' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400 text-center mb-8">
              {showAdminLogin ? 'Login to admin account' : 'Login to your account'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="input-field"
                  placeholder={showAdminLogin ? 'dolph17wwe@gmail.com' : 'your@email.com'}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="input-field"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {!showAdminLogin && (
                <>
                  <p className="text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-cyan-400 hover:text-cyan-300">
                      Sign up
                    </Link>
                  </p>

                  <div className="text-center">
                    <span className="text-gray-400 text-sm">or</span>
                  </div>

                  <button
                    onClick={() => setShowAdminLogin(true)}
                    className="btn-secondary w-full"
                  >
                    Admin Login
                  </button>
                </>
              )}

              {showAdminLogin && (
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="btn-secondary w-full"
                >
                  Back to User Login
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}