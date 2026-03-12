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

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'barber';
  gender?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      toast.success(`${data.role === 'barber' ? 'Barber' : 'User'} registration successful! Please login.`);
      // Redirect to login page after successful registration
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const firstError = Array.isArray(validationErrors) ? validationErrors[0] : validationErrors;
        toast.error(firstError?.msg || firstError?.message || 'Validation failed');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message === 'Network Error' || !error.response) {
        toast.error('Cannot connect to server. Please make sure the backend is running.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
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
            <h1 className="text-3xl font-bold mb-2 neon-text text-center">Create Account</h1>
            <p className="text-gray-400 text-center mb-8">Sign up to get started</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="input-field"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  className="input-field"
                  placeholder="9876543210"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="input-field"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">I want to register as</label>
                <select
                  {...register('role', { required: 'Please select a role' })}
                  className="input-field"
                >
                  <option value="">Select Role</option>
                  <option value="user">User (Customer)</option>
                  <option value="barber">Barber</option>
                </select>
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gender (Optional)</label>
                <select {...register('gender')} className="input-field">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center mt-6 text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
