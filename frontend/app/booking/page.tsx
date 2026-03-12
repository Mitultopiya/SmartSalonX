'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Layout/Navbar';
import toast from 'react-hot-toast';

interface TimeSlot {
  start: string;
  end: string;
  displayTime: string;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const salonId = searchParams.get('salonId');
  const barberId = searchParams.get('barberId');
  const servicesParam = searchParams.get('services');
  const hairstyleId = searchParams.get('hairstyleId'); // fallback single-service
  const gender = searchParams.get('gender');

  const serviceIds = useMemo(
    () =>
      servicesParam
        ? servicesParam
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    [servicesParam]
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [rewardPointsUsed, setRewardPointsUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate && !isNaN(selectedDate.getTime()) && barberId && (serviceIds.length > 0 || hairstyleId)) {
      fetchTimeSlots();
    }
  }, [selectedDate, barberId, hairstyleId, serviceIds]);

  const fetchTimeSlots = async () => {
    try {
      if (!selectedDate || isNaN(selectedDate.getTime())) {
        console.error('Invalid selectedDate');
        return;
      }
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await api.get('/appointments/slots', {
        params: {
          barberId,
          ...(serviceIds.length > 0
            ? { serviceIds: serviceIds.join(',') }
            : { hairstyleId }),
          date: dateStr,
        },
      });
      setTimeSlots(response.data);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleCreateAppointment = async () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    setLoading(true);
    try {
      const slot = timeSlots.find((s) => s.start === selectedSlot);
      if (!slot) return;

      const response = await api.post('/appointments', {
        salonId,
        barberId,
        ...(serviceIds.length > 0 ? { serviceIds } : { hairstyleId }),
        startTime: slot.start,
        rewardPointsUsed,
      });

      setAppointment(response.data);
      // Initiate simulated payment transaction
      const txRes = await api.post('/payments/initiate', {
        appointmentId: response.data._id,
      });
      setTransactionId(txRes.data.transactionId);
      router.push(`/payment/simulate/${response.data._id}?transactionId=${txRes.data.transactionId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const maxRewardPoints = Math.min(user?.rewardPoints || 0, appointment?.price || 0);

  return (
    <div className="min-h-screen bg-dark-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8 neon-text"
          >
            Book Appointment
          </motion.h1>

          {appointment ? (
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Appointment Created</h2>
              <p className="text-gray-400 mb-4">
                Please complete the payment to confirm your appointment.
              </p>
              <div className="space-y-2">
                <p>Amount: ₹{appointment.finalAmount}</p>
                <p>Date: {new Date(appointment.startTime).toLocaleDateString()}</p>
                <p>Time: {new Date(appointment.startTime).toLocaleTimeString()}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Date Selection */}
              <div className="card mb-6">
                <h2 className="text-xl font-bold mb-4">Select Date</h2>
                <input
                  type="date"
                  value={selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setSelectedDate(newDate);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              {/* Time Slots */}
              <div className="card mb-6">
                <h2 className="text-xl font-bold mb-4">Select Time</h2>
                {timeSlots.length === 0 ? (
                  <p className="text-gray-400">No available slots for this date</p>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.start}
                        onClick={() => setSelectedSlot(slot.start)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSlot === slot.start
                            ? 'border-cyan-500 bg-cyan-500/20'
                            : 'border-dark-300 hover:border-cyan-500/50'
                        }`}
                      >
                        {slot.displayTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reward Points */}
              {user?.rewardPoints && user.rewardPoints > 0 && (
                <div className="card mb-6">
                  <h2 className="text-xl font-bold mb-4">Use Reward Points</h2>
                  <p className="text-gray-400 mb-2">
                    Available: {user.rewardPoints} points (100 points = ₹100)
                  </p>
                  <input
                    type="number"
                    min="0"
                    max={maxRewardPoints}
                    value={rewardPointsUsed}
                    onChange={(e) => setRewardPointsUsed(parseInt(e.target.value) || 0)}
                    className="input-field"
                    placeholder="Points to use"
                  />
                </div>
              )}

              <button
                onClick={handleCreateAppointment}
                disabled={!selectedSlot || loading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
