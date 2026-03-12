'use client';

import { useState, useEffect, useRef } from 'react';

export default function CameraDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('Page loaded');
    checkCameraSupport();
    listCameras();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkCameraSupport = () => {
    addLog(`User Agent: ${navigator.userAgent}`);
    addLog(`HTTPS: ${window.isSecureContext}`);
    addLog(`Hostname: ${window.location.hostname}`);
    addLog(`Protocol: ${window.location.protocol}`);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      addLog('❌ Camera API not supported');
      return false;
    }
    
    addLog('✅ Camera API supported');
    return true;
  };

  const listCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setCameraList(cameras);
      addLog(`Found ${cameras.length} camera(s)`);
      cameras.forEach((camera, index) => {
        addLog(`Camera ${index + 1}: ${camera.label || 'Unknown'}`);
      });
    } catch (error) {
      addLog(`❌ Error listing cameras: ${error}`);
    }
  };

  const testCameraAccess = async (deviceId?: string) => {
    try {
      addLog('🎬 Requesting camera access...');
      
      const constraints: MediaStreamConstraints = {
        video: deviceId 
          ? { deviceId: { exact: deviceId } }
          : {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      addLog('✅ Camera access granted!');
      addLog(`Stream active: ${mediaStream.active}`);
      addLog(`Video tracks: ${mediaStream.getVideoTracks().length}`);
      
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        addLog(`Resolution: ${settings.width}x${settings.height}`);
        addLog(`Device ID: ${settings.deviceId}`);
      }
      
    } catch (error: any) {
      addLog(`❌ Camera access failed: ${error.name}`);
      addLog(`Error message: ${error.message}`);
      
      if (error.name === 'NotAllowedError') {
        addLog('🔒 Permission denied - user blocked camera');
      } else if (error.name === 'NotFoundError') {
        addLog('📷 No camera found');
      } else if (error.name === 'NotReadableError') {
        addLog('🔒 Camera is already in use');
      } else if (error.name === 'OverconstrainedError') {
        addLog('⚠️ Camera constraints too high');
      } else if (error.name === 'SecurityError') {
        addLog('🔒 Security error - check HTTPS');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      addLog('🛑 Camera stopped');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎥 Camera Debug Tool</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Camera Preview</h2>
            <div className="bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => testCameraAccess()}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-full"
              >
                Test Default Camera
              </button>
              
              {cameraList.map((camera, index) => (
                <button
                  key={camera.deviceId}
                  onClick={() => testCameraAccess(camera.deviceId)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded w-full text-sm"
                >
                  Test Camera {index + 1}: {camera.label || 'Unknown'}
                </button>
              ))}
              
              <button
                onClick={stopCamera}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full"
              >
                Stop Camera
              </button>
            </div>
          </div>
          
          {/* Logs Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
            <button
              onClick={() => setLogs([])}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded mt-4"
            >
              Clear Logs
            </button>
          </div>
        </div>
        
        {/* Browser Info */}
        <div className="bg-gray-800 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Browser Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Browser:</strong> {navigator.userAgent.split(' ')[0]}
            </div>
            <div>
              <strong>Platform:</strong> {navigator.platform}
            </div>
            <div>
              <strong>Secure Context:</strong> {window.isSecureContext ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>Current URL:</strong> {window.location.href}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
