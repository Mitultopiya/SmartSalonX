'use client';

import { motion } from 'framer-motion';
import { Camera, Upload, AlertCircle, CheckCircle, ArrowRight, RotateCw } from 'lucide-react';

interface CameraInstructionsProps {
  mode: 'camera' | 'upload';
  currentStep: number;
  isCapturing: boolean;
}

export default function CameraInstructions({ mode, currentStep, isCapturing }: CameraInstructionsProps) {
  const cameraInstructions = [
    {
      title: "Position Your Face",
      description: "Center your face in the frame, ensuring full visibility from forehead to chin",
      icon: <Camera className="h-5 w-5" />,
      tips: [
        "Maintain a neutral expression",
        "Keep hair pulled back from forehead",
        "Ensure even lighting on your face",
        "Remove glasses if possible"
      ]
    },
    {
      title: "Check Lighting",
      description: "Ensure your face is well-lit without shadows or harsh backlighting",
      icon: <AlertCircle className="h-5 w-5" />,
      tips: [
        "Face a natural light source",
        "Avoid direct overhead lighting",
        "No strong shadows on face",
        "Background should be plain"
      ]
    },
    {
      title: "Distance & Angle",
      description: "Position camera at arm's length, straight-on angle",
      icon: <ArrowRight className="h-5 w-5" />,
      tips: [
        "Hold camera 12-18 inches from face",
        "Keep camera at eye level",
        "Avoid tilting your head",
        "Face directly forward"
      ]
    },
    {
      title: "Capture Multiple Views",
      description: "We'll capture front, left, and right profiles for accurate analysis",
      icon: <RotateCw className="h-5 w-5" />,
      tips: [
        "Front view: Face forward directly",
        "Left profile: Turn 90° to left",
        "Right profile: Turn 90° to right",
        "Follow on-screen prompts"
      ]
    }
  ];

  const uploadInstructions = [
    {
      title: "Choose Clear Photos",
      description: "Select high-quality photos that clearly show your facial features",
      icon: <Upload className="h-5 w-5" />,
      tips: [
        "Use recent photos (within 6 months)",
        "Ensure face is clearly visible",
        "Avoid filters or heavy editing",
        "Multiple angles recommended"
      ]
    },
    {
      title: "Photo Requirements",
      description: "Follow these guidelines for best analysis results",
      icon: <CheckCircle className="h-5 w-5" />,
      tips: [
        "Minimum 500x500 resolution",
        "Face should occupy 60-80% of image",
        "Good lighting and focus",
        "Front and side views preferred"
      ]
    },
    {
      title: "Upload Multiple Views",
      description: "Upload front, left, and right profile photos for comprehensive analysis",
      icon: <Camera className="h-5 w-5" />,
      tips: [
        "Front view: Straight-on photo",
        "Left profile: Side view from left",
        "Right profile: Side view from right",
        "Consistent lighting across photos"
      ]
    }
  ];

  const instructions = mode === 'camera' ? cameraInstructions : uploadInstructions;

  return (
    <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-xl p-6 border border-cyan-500/30">
      <h3 className="text-xl font-semibold mb-4 text-cyan-400">
        {mode === 'camera' ? '📷 Camera Guidelines' : '📁 Upload Guidelines'}
      </h3>
      
      <div className="space-y-4">
        {instructions.map((instruction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border transition-all ${
              currentStep === index 
                ? 'bg-cyan-900/30 border-cyan-400/50' 
                : 'bg-dark-200/30 border-dark-400/30'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                currentStep === index ? 'bg-cyan-500 text-white' : 'bg-dark-300 text-gray-400'
              }`}>
                {instruction.icon}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${
                  currentStep === index ? 'text-cyan-400' : 'text-white'
                }`}>
                  {instruction.title}
                </h4>
                <p className="text-gray-300 text-sm mb-3">{instruction.description}</p>
                
                <div className="space-y-1">
                  {instruction.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-center space-x-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        currentStep === index ? 'bg-cyan-400' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-gray-400">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Important Notes */}
      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">Important Notes</h4>
            <ul className="text-yellow-200 text-sm space-y-1">
              <li>• Ensure your camera has permission to access</li>
              <li>• Use HTTPS connection for camera access</li>
              <li>• Close other apps using your camera</li>
              <li>• For best results, capture in good lighting conditions</li>
              <li>• Analysis accuracy depends on photo quality</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      {isCapturing && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">
              {mode === 'camera' ? 'Camera is active - Follow the instructions above' : 'Ready to upload photos'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
