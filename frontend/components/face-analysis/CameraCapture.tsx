'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, CameraOff, RotateCw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string, view: 'front' | 'left' | 'right') => void;
  currentView: 'front' | 'left' | 'right';
  onViewChange: (view: 'front' | 'left' | 'right') => void;
}

export default function CameraCapture({ onCapture, currentView, onViewChange }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string>('');

  const startCamera = useCallback(async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Check if we're on HTTPS or localhost
      const isSecureContext = window.isSecureContext || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1';
      
      if (!isSecureContext) {
        throw new Error('Camera access requires HTTPS or localhost. Please use a secure connection.');
      }

      // Try different camera configurations
      let stream: MediaStream | null = null;
      const configs = [
        {
          video: {
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        },
        {
          video: {
            facingMode,
            width: { ideal: 320 },
            height: { ideal: 240 }
          }
        },
        {
          video: true
        }
      ];

      for (const config of configs) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(config);
          break;
        } catch (configError) {
          console.log('Config failed, trying next:', configError);
          continue;
        }
      }

      if (!stream) {
        throw new Error('Unable to access camera with any configuration');
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError('');
      }
    } catch (err: any) {
      let errorMessage = 'Unable to access camera. Please check permissions.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings and refresh the page.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please ensure your device has a camera connected.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application. Please close other apps using the camera.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not support the required settings. Please try a different device.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Camera error:', err);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageData, currentView);
      }
    }
  }, [onCapture, currentView]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  useEffect(() => {
    if (isStreaming) {
      stopCamera();
      startCamera();
    }
  }, [facingMode]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getViewInstructions = () => {
    switch (currentView) {
      case 'front':
        return 'Position your face facing forward, looking directly at the camera';
      case 'left':
        return 'Turn your head to show your left side profile';
      case 'right':
        return 'Turn your head to show your right side profile';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Camera Capture - {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View
        </h3>
        <p className="text-gray-600 text-sm">{getViewInstructions()}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium mb-2">{error}</p>
          <div className="text-red-500 text-xs space-y-1">
            <p>💡 <strong>Troubleshooting tips:</strong></p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Make sure you're using https://localhost:3000 (not http://)</li>
              <li>Allow camera permissions when prompted by your browser</li>
              <li>Check if your camera is not being used by another app</li>
              <li>Try refreshing the page and granting permissions again</li>
              <li>If using a mobile device, ensure camera is not blocked in settings</li>
            </ul>
          </div>
        </div>
      )}

      <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${!isStreaming ? 'hidden' : ''}`}
        />
        
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">Camera is off</p>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-3 justify-center">
        {!isStreaming ? (
          <button
            onClick={startCamera}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={captureImage}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Camera className="w-5 h-5" />
              Capture
            </button>
            
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <CameraOff className="w-5 h-5" />
              Stop
            </button>

            <button
              onClick={switchCamera}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCw className="w-5 h-5" />
              Switch
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {(['front', 'left', 'right'] as const).map((view) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === view
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
