'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Layout/Navbar';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface RegisterForm {
  salonId: string;
  specialization: string;
  experience: number;
  workingHours: string;
  certificate: FileList;
}

export default function BarberRegisterPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const response = await api.get('/salons');
      setSalons(response.data);
    } catch (error) {
      console.error('Error fetching salons:', error);
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('salonId', data.salonId);
      formData.append('specialization', JSON.stringify(data.specialization.split(',')));
      formData.append('experience', data.experience.toString());
      formData.append('workingHours', data.workingHours);
      if (data.certificate && data.certificate[0]) {
        formData.append('certificate', data.certificate[0]);
      }

      await api.post('/barbers/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Barber registration submitted! Pending admin approval.');
      router.push('/barber/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h1 className="text-3xl font-bold mb-2 neon-text">Register as Barber</h1>
            <p className="text-gray-400 mb-8">Complete your barber profile</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Salon</label>
                <select
                  {...register('salonId', { required: 'Salon is required' })}
                  className="input-field"
                >
                  <option value="">Select a salon</option>
                  {salons.map((salon) => (
                    <option key={salon._id} value={salon._id}>
                      {salon.name}
                    </option>
                  ))}
                </select>
                {errors.salonId && (
                  <p className="text-red-400 text-sm mt-1">{errors.salonId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Specialization (comma-separated)
                </label>
                <input
                  type="text"
                  {...register('specialization', { required: 'Specialization is required' })}
                  className="input-field"
                  placeholder="haircut, styling, beard"
                />
                {errors.specialization && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.specialization.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Experience (years)</label>
                <input
                  type="number"
                  {...register('experience', {
                    required: 'Experience is required',
                    min: { value: 0, message: 'Experience must be 0 or more' },
                  })}
                  className="input-field"
                  placeholder="5"
                />
                {errors.experience && (
                  <p className="text-red-400 text-sm mt-1">{errors.experience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Working Hours (JSON format)
                </label>
                <textarea
                  {...register('workingHours', { required: 'Working hours are required' })}
                  className="input-field"
                  rows={5}
                  placeholder='{"monday": {"start": "09:00", "end": "18:00", "isWorking": true}, ...}'
                />
                {errors.workingHours && (
                  <p className="text-red-400 text-sm mt-1">{errors.workingHours.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Certificate (Optional)
                </label>
                <input
                  type="file"
                  {...register('certificate')}
                  accept="image/*"
                  className="input-field"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Upload your barber certificate for AI verification
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
