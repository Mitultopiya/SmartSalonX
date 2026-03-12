'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import Navbar from '@/components/Layout/Navbar';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CertificateUploadPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [salons, setSalons] = useState<any[]>([]);
  const [selectedSalon, setSelectedSalon] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'barber') {
      router.push('/login');
      return;
    }
    fetchSalons();
  }, [user, router]);

  const fetchSalons = async () => {
    try {
      const response = await api.get('/salons');
      setSalons(response.data);
      if (response.data.length > 0) {
        setSelectedSalon(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch salons:', error);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      setFile(file);
    } else {
      toast.error('Please upload an image or PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (!selectedSalon) {
      toast.error('Please select a salon');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('certificate', file);
    
    // Add required fields for barber registration
    formData.append('salonId', selectedSalon);
    formData.append('specialization', JSON.stringify(['haircut', 'styling']));
    formData.append('experience', '2');
    formData.append('workingHours', JSON.stringify({
      monday: { start: '09:00', end: '18:00', isWorking: true },
      tuesday: { start: '09:00', end: '18:00', isWorking: true },
      wednesday: { start: '09:00', end: '18:00', isWorking: true },
      thursday: { start: '09:00', end: '18:00', isWorking: true },
      friday: { start: '09:00', end: '18:00', isWorking: true },
      saturday: { start: '09:00', end: '18:00', isWorking: true },
      sunday: { start: '10:00', end: '16:00', isWorking: false },
    }));

    try {
      // Get barber profile to check if already exists
      const profileRes = await api.get('/barbers/profile');
      
      if (profileRes.data) {
        toast.error('Certificate already uploaded. Please wait for admin approval.');
        router.push('/barber/dashboard');
        return;
      }
    } catch (error) {
      // Profile doesn't exist, proceed with registration
    }

    try {
      // Create barber profile with certificate
      await api.post('/barbers/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Certificate uploaded successfully! Please wait for admin approval.');
      router.push('/barber/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
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
            <h1 className="text-3xl font-bold mb-2 neon-text text-center">Upload Certificate</h1>
            <p className="text-gray-400 text-center mb-8">
              Please upload your professional certificate to verify your identity
            </p>

            <div className="space-y-6">
              {/* Salon Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Salon</label>
                <select
                  value={selectedSalon}
                  onChange={(e) => setSelectedSalon(e.target.value)}
                  className="input-field"
                  disabled={salons.length === 0}
                >
                  <option value="">Choose a salon...</option>
                  {salons.map((salon) => (
                    <option key={salon._id} value={salon._id}>
                      {salon.name} - {salon.address?.city}
                    </option>
                  ))}
                </select>
                {salons.length === 0 && (
                  <p className="text-yellow-400 text-sm mt-1">Loading available salons...</p>
                )}
              </div>

              {/* Certificate Upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                  className="hidden"
                  id="certificate-upload"
                />
                <label htmlFor="certificate-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-gray-300 mb-2">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-gray-500 text-sm">
                      PNG, JPG, GIF, PDF up to 10MB
                    </p>
                  </div>
                </label>
              </div>

              {file && (
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="btn-primary w-full"
              >
                {uploading ? 'Uploading...' : 'Upload Certificate'}
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Note:</strong> Your certificate will be reviewed by an admin. You'll be notified once it's approved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}