'use client';

import { useState, useRef } from 'react';
import { Camera, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface DiagnosticResult {
  step: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  details?: string;
}

export default function CameraDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([
    { step: 'Check Browser Support', status: 'pending', message: '' },
    { step: 'Check Secure Context', status: 'pending', message: '' },
    { step: 'Check Camera Devices', status: 'pending', message: '' },
    { step: 'Test Basic Camera Access', status: 'pending', message: '' },
    { step: 'Test Different Configurations', status: 'pending', message: '' },
    { step: 'Check Permissions', status: 'pending', message: '' }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (index: number, status: DiagnosticResult['status'], message: string, details?: string) => {
    setResults(prev => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], status, message, details };
      return newResults;
    });
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    
    // Step 1: Check Browser Support
    updateResult(0, 'running', 'Checking browser support...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      updateResult(0, 'failed', 'Camera API not supported', 'Your browser does not support camera access. Try Chrome, Firefox, or Edge.');
      setIsRunning(false);
      return;
    }
    updateResult(0, 'passed', 'Camera API supported', `User Agent: ${navigator.userAgent.substring(0, 50)}...`);

    // Step 2: Check Secure Context
    updateResult(1, 'running', 'Checking secure context...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const isSecure = window.isSecureContext || 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1';
    
    if (!isSecure) {
      updateResult(1, 'failed', 'Not a secure context', `Current URL: ${window.location.href}. Camera access requires HTTPS or localhost.`);
      setIsRunning(false);
      return;
    }
    updateResult(1, 'passed', 'Secure context detected', `URL: ${window.location.href}`);

    // Step 3: Check Camera Devices
    updateResult(2, 'running', 'Enumerating camera devices...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        updateResult(2, 'failed', 'No camera devices found', 'No cameras detected on your system. Please check if a camera is connected.');
        setIsRunning(false);
        return;
      }
      
      const deviceList = videoDevices.map((device, index) => 
        `${index + 1}. ${device.label || 'Unknown Camera'} (ID: ${device.deviceId.substring(0, 8)}...)`
      ).join('\n');
      
      updateResult(2, 'passed', `${videoDevices.length} camera(s) found`, deviceList);
    } catch (error: any) {
      updateResult(2, 'failed', 'Failed to enumerate devices', error.message);
      setIsRunning(false);
      return;
    }

    // Step 4: Test Basic Camera Access
    updateResult(3, 'running', 'Testing basic camera access...');
    let stream: MediaStream | null = null;
    
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      
      if (stream.getVideoTracks().length === 0) {
        throw new Error('No video tracks in stream');
      }
      
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      
      updateResult(3, 'passed', 'Basic camera access successful', 
        `Resolution: ${settings.width}x${settings.height}, Device: ${track.label || 'Unknown'}`
      );
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error: any) {
      let errorMsg = 'Unknown error';
      let details = '';
      
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Permission denied';
        details = 'Camera permission was denied. Please check browser settings and allow camera access.';
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'No camera found';
        details = 'No camera device was found on your system.';
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'Camera in use';
        details = 'Camera is already being used by another application. Close other apps and try again.';
      } else if (error.name === 'OverconstrainedError') {
        errorMsg = 'Constraints not satisfied';
        details = 'Camera does not support the requested settings.';
      } else if (error.name === 'SecurityError') {
        errorMsg = 'Security error';
        details = 'Camera access blocked due to security restrictions.';
      }
      
      updateResult(3, 'failed', errorMsg, details);
      setIsRunning(false);
      return;
    }

    // Step 5: Test Different Configurations
    updateResult(4, 'running', 'Testing different camera configurations...');
    const configs = [
      { name: 'High Quality', config: { video: { width: 1280, height: 720 } } },
      { name: 'Medium Quality', config: { video: { width: 640, height: 480 } } },
      { name: 'Low Quality', config: { video: { width: 320, height: 240 } } },
      { name: 'Front Camera', config: { video: { facingMode: 'user' } } },
      { name: 'Rear Camera', config: { video: { facingMode: 'environment' } } }
    ];
    
    const workingConfigs: string[] = [];
    
    for (const testConfig of configs) {
      try {
        const testStream = await navigator.mediaDevices.getUserMedia(testConfig.config);
        testStream.getTracks().forEach(track => track.stop());
        workingConfigs.push(testConfig.name);
      } catch (error) {
        // Config failed, continue
      }
    }
    
    if (workingConfigs.length > 0) {
      updateResult(4, 'passed', `${workingConfigs.length} configurations work`, 
        `Working: ${workingConfigs.join(', ')}`
      );
    } else {
      updateResult(4, 'failed', 'No configurations work', 'All camera configurations failed. This indicates a serious camera access issue.');
    }

    // Step 6: Check Permissions
    updateResult(5, 'running', 'Checking permission status...');
    
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      updateResult(5, 'passed', `Permission status: ${permission.state}`, 
        `State: ${permission.state}`
      );
    } catch (error) {
      updateResult(5, 'passed', 'Permission API not available', 'Some browsers do not support the permissions API.');
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
      case 'running':
        return <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const allPassed = results.every(r => r.status === 'passed');
  const hasFailed = results.some(r => r.status === 'failed');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🔍 Camera Diagnostic Tool</h2>
        <p className="text-gray-600">Comprehensive camera access diagnosis to identify and resolve issues</p>
      </div>

      <div className="mb-6">
        <button
          onClick={runDiagnostic}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          <Camera className="w-5 h-5" />
          {isRunning ? 'Running Diagnostic...' : 'Run Camera Diagnostic'}
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start gap-3">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-800">{result.step}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    result.status === 'passed' ? 'bg-green-100 text-green-800' :
                    result.status === 'failed' ? 'bg-red-100 text-red-800' :
                    result.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                {result.message && (
                  <p className="text-sm text-gray-600 mb-1">{result.message}</p>
                )}
                {result.details && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded whitespace-pre-line">
                    {result.details}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {allPassed && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">✅ All tests passed! Camera should work correctly.</span>
          </div>
        </div>
      )}

      {hasFailed && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2 text-red-800">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div>
              <span className="font-medium">❌ Camera issues detected</span>
              <div className="mt-2 text-sm text-red-700">
                <p><strong>Common solutions:</strong></p>
                <ul className="ml-4 list-disc mt-1 space-y-1">
                  <li>Use Chrome, Firefox, or Edge browser</li>
                  <li>Access via https://localhost:3000 (not http://)</li>
                  <li>Allow camera permissions when prompted</li>
                  <li>Close other apps using the camera</li>
                  <li>Restart browser and try again</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2 text-blue-800">
          <Info className="w-5 h-5 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">💡 Pro Tip:</p>
            <p>If all tests pass but camera still doesn't work, try refreshing the page and granting camera permissions again when prompted.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
