'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import anime from 'animejs';

const VantaBackground = dynamic(() => import('@/components/Animations/VantaBackground'), {
  ssr: false,
});

export default function PaymentSimulatePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = params.appointmentId as string;
  const transactionId = searchParams.get('transactionId');

  const [loading, setLoading] = useState(false);
  const btnWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable back navigation (examiner-safe simulated gateway behavior)
    const onPopState = () => {
      history.pushState(null, '', window.location.href);
      toast.error('Back navigation disabled during payment simulation');
    };
    history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (btnWrapRef.current) {
      anime({
        targets: btnWrapRef.current.querySelectorAll('.pay-btn'),
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(120),
        duration: 600,
        easing: 'easeOutExpo',
      });
    }
  }, []);

  const simulate = async (result: 'SUCCESS' | 'FAILED') => {
    if (!transactionId) {
      toast.error('Missing transactionId');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/payments/simulate', {
        appointmentId,
        transactionId,
        result,
      });

      if (result === 'SUCCESS') {
        toast.success('Payment successful! Appointment confirmed.');
        router.replace('/appointments');
      } else {
        toast.error('Payment failed. Appointment cancelled.');
        router.replace(`/salons?gender=male`);
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <VantaBackground />
      <Navbar />

      <div className="pt-24 pb-12 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 neon-text"
          >
            Simulated UPI Payment
          </motion.h1>
          <p className="text-gray-300 mb-8">
            This is a demo payment gateway. Choose an outcome to simulate a real payment flow.
          </p>

          <div className="card" ref={btnWrapRef}>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                className="pay-btn btn-primary flex-1 text-lg py-5 disabled:opacity-50"
                disabled={loading}
                onClick={() => simulate('SUCCESS')}
              >
                ✅ Simulate Payment Success
              </button>
              <button
                className="pay-btn btn-secondary flex-1 text-lg py-5 disabled:opacity-50"
                disabled={loading}
                onClick={() => simulate('FAILED')}
              >
                ❌ Simulate Payment Failure
              </button>
            </div>

            {loading && (
              <div className="mt-6 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="text-gray-400 mt-3">Processing...</p>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-500">
              <div>
                <span className="text-gray-400">Appointment:</span> {appointmentId}
              </div>
              <div>
                <span className="text-gray-400">Transaction:</span> {transactionId || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

