'use client';

import { useState, useEffect } from 'react';
import { Camera, Upload, Sparkles, Clock, User, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import CameraCapture from '@/components/face-analysis/CameraCapture';
import ImageUpload from '@/components/face-analysis/ImageUpload';
import DynamicFaceDetector from '@/components/face-analysis/DynamicFaceDetector';
import DynamicAnalysisDisplay from '@/components/face-analysis/DynamicAnalysisDisplay';
import FaceAnalysisDisplay from '@/components/face-analysis/FaceAnalysisDisplay';
import StyleRecommendations from '@/components/face-analysis/StyleRecommendations';
import CameraInstructions from '@/components/face-analysis/CameraInstructions';
import VirtualTryOn from '@/components/face-analysis/VirtualTryOn';

interface FaceAnalysisResult {
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong';
  measurements: any;
  confidence: number;
  landmarks: any;
}

interface Style {
  _id: string;
  name: string;
  category: 'hairstyle' | 'beard' | 'treatment' | 'coloring' | 'styling';
  suitableFaceShapes: string[];
  images: string[];
  description: string;
  popularity: number;
  tags: string[];
  price?: number;
  duration?: number;
  difficulty?: string;
  maintenance?: string;
  seasons?: string[];
  ageGroups?: string[];
  hairTypes?: string[];
  suitability?: string;
  whyItWorks?: string;
}

export default function StyleAdvisorPage() {
  const [currentStep, setCurrentStep] = useState<'capture' | 'analysis' | 'recommendations' | 'try-on'>('capture');
  const [captureMethod, setCaptureMethod] = useState<'camera' | 'upload'>('camera');
  const [currentView, setCurrentView] = useState<'front' | 'left' | 'right'>('front');
  const [capturedImages, setCapturedImages] = useState<Record<string, string>>({});
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysisResult | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<Style[]>([]);
  const [analysisError, setAnalysisError] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleImageCapture = (imageData: string, view: 'front' | 'left' | 'right') => {
    setCapturedImages(prev => ({
      ...prev,
      [view]: imageData
    }));

    // Auto-advance to next view or analysis
    if (view === 'front') {
      setCurrentView('left');
    } else if (view === 'left') {
      setCurrentView('right');
    } else if (view === 'right') {
      setCurrentStep('analysis');
    }
  };

  const handleAnalysisComplete = (result: FaceAnalysisResult) => {
    setFaceAnalysis(result);
    setCurrentStep('recommendations');
    setIsAnalyzing(false);
  };

  const handleAnalysisError = (error: string) => {
    setAnalysisError(error);
    setIsAnalyzing(false);
  };

  const handleStyleSelect = (style: Style) => {
    setSelectedStyles(prev => {
      const exists = prev.find(s => s._id === style._id);
      if (exists) {
        return prev.filter(s => s._id !== style._id);
      } else {
        return [...prev, style];
      }
    });
  };

  const handleStyleRemove = (styleId: string) => {
    setSelectedStyles(prev => prev.filter(s => s._id !== styleId));
  };

  const handleBookAppointment = () => {
    // Navigate to booking with pre-selected styles
    const styleIds = selectedStyles.map(s => s._id).join(',');
    const styleNames = selectedStyles.map(s => s.name).join(', ');
    const bookingUrl = `/book-appointment?styleIds=${styleIds}&styleNames=${encodeURIComponent(styleNames)}`;
    window.location.href = bookingUrl;
  };

  const handleReshuffle = () => {
    // Clear current analysis and trigger new random analysis
    setFaceAnalysis(null);
    // Force re-analysis by adding timestamp to image
    if (capturedImages.front) {
      const timestampedImage = capturedImages.front + '?t=' + Date.now();
      setCapturedImages(prev => ({ ...prev, front: timestampedImage }));
    }
  };

  const handleSaveStyle = (styleData: string) => {
    // Save the virtual try-on result
    console.log('Saving style data:', styleData);
    // In a real app, this would save to user profile or gallery
    alert('Style saved to your profile!');
  };

  const resetProcess = () => {
    setCurrentStep('capture');
    setCapturedImages({});
    setFaceAnalysis(null);
    setSelectedStyle(null);
    setSelectedStyles([]);
    setAnalysisError('');
    setCurrentView('front');
    setGender('male');
  };

  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'capture': return 25;
      case 'analysis': return 50;
      case 'recommendations': return 75;
      case 'try-on': return 100;
      default: return 0;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'capture': return 'Capture Your Face';
      case 'analysis': return 'Analyzing Your Features';
      case 'recommendations': return 'Your Style Recommendations';
      case 'try-on': return 'Virtual Try-On';
      default: return 'Style Advisor';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'capture': return 'Take photos from front, left, and right angles';
      case 'analysis': return 'AI is analyzing your facial features';
      case 'recommendations': return 'Personalized styles for your face shape';
      case 'try-on': return 'See how you look with different styles';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AI Style Advisor</h1>
                <p className="text-gray-600 text-sm">Find your perfect style recommendations</p>
              </div>
            </div>
            
            {/* Gender Selection */}
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setGender('male')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    gender === 'male'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  👨‍🦱 Male
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    gender === 'female'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  👩‍🦰 Female
                </button>
              </div>
              
              {currentStep !== 'capture' && (
                <button
                  onClick={resetProcess}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Start Over
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Camera className={`w-4 h-4 ${currentStep === 'capture' ? 'text-blue-600' : 'text-green-600'}`} />
                <span className={`text-sm ${currentStep === 'capture' ? 'text-blue-600 font-medium' : 'text-green-600'}`}>
                  Capture
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className={`w-4 h-4 ${currentStep === 'analysis' ? 'text-blue-600' : currentStep === 'capture' ? 'text-gray-400' : 'text-green-600'}`} />
                <span className={`text-sm ${currentStep === 'analysis' ? 'text-blue-600 font-medium' : currentStep === 'capture' ? 'text-gray-400' : 'text-green-600'}`}>
                  Analysis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${currentStep === 'recommendations' ? 'text-blue-600' : ['capture', 'analysis'].includes(currentStep) ? 'text-gray-400' : 'text-green-600'}`} />
                <span className={`text-sm ${currentStep === 'recommendations' ? 'text-blue-600 font-medium' : ['capture', 'analysis'].includes(currentStep) ? 'text-gray-400' : 'text-green-600'}`}>
                  Recommendations
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${currentStep === 'try-on' ? 'text-blue-600' : ['capture', 'analysis', 'recommendations'].includes(currentStep) ? 'text-gray-400' : 'text-green-600'}`} />
                <span className={`text-sm ${currentStep === 'try-on' ? 'text-blue-600 font-medium' : ['capture', 'analysis', 'recommendations'].includes(currentStep) ? 'text-gray-400' : 'text-green-600'}`}>
                  Try-On
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{getStepTitle()}</h2>
          <p className="text-gray-600">{getStepDescription()}</p>
        </div>

        {/* Step Content */}
        <div className="space-y-8">
          {currentStep === 'capture' && (
            <div>
              {/* Capture Method Selection */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setCaptureMethod('camera')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    captureMethod === 'camera'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  Live Camera
                </button>
                <button
                  onClick={() => setCaptureMethod('upload')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    captureMethod === 'upload'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Upload Photos
                </button>
              </div>

              {/* Capture Component */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {captureMethod === 'camera' ? (
                    <CameraCapture
                      onCapture={handleImageCapture}
                      currentView={currentView}
                      onViewChange={setCurrentView}
                    />
                  ) : (
                    <ImageUpload
                      onUpload={handleImageCapture}
                      currentView={currentView}
                      onViewChange={setCurrentView}
                      capturedImages={capturedImages}
                    />
                  )}
                </div>
                <div>
                  <CameraInstructions
                    mode={captureMethod}
                    currentStep={Object.keys(capturedImages).length}
                    isCapturing={currentStep === 'capture'}
                  />
                </div>
              </div>

              {/* Manual Analysis Trigger */}
              {capturedImages.front && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setCurrentStep('analysis')}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
                  >
                    Analyze My Face
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Selected Styles Booking */}
              {selectedStyles.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-xl border border-cyan-500/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-semibold">Selected {selectedStyles.length} Style(s)</h4>
                      <p className="text-cyan-400">
                        Total: ₹{selectedStyles.reduce((sum, style) => sum + (style.price || 0), 0)} • 
                        {selectedStyles.reduce((sum, style) => sum + (style.duration || 0), 0)} min
                      </p>
                    </div>
                    <button
                      onClick={handleBookAppointment}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'analysis' && capturedImages.front && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <DynamicFaceDetector
                  imageUrl={capturedImages.front}
                  onAnalysisComplete={handleAnalysisComplete}
                  onError={handleAnalysisError}
                  onReshuffle={handleReshuffle}
                />
              </div>
              <div>
                <DynamicAnalysisDisplay 
                  analysis={faceAnalysis} 
                  isAnalyzing={isAnalyzing}
                />
              </div>
            </div>
          )}

          {currentStep === 'recommendations' && faceAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <StyleRecommendations
                  faceAnalysis={faceAnalysis}
                  onSelectStyle={handleStyleSelect}
                  onBookAppointment={() => {}}
                  gender={gender}
                />
              </div>
              <div>
                <FaceAnalysisDisplay
                  analysis={faceAnalysis}
                  isAnalyzing={isAnalyzing}
                  error={analysisError}
                />
              </div>
            </div>
          )}

          {currentStep === 'try-on' && selectedStyle && capturedImages.front && (
            <VirtualTryOn
              userImage={capturedImages.front}
              selectedStyle={selectedStyle}
              onClose={() => setCurrentStep('recommendations')}
              onSaveStyle={handleSaveStyle}
            />
          )}
        </div>

        {/* Error Display */}
        {analysisError && (
          <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-red-800 font-medium">Analysis Error</h4>
                <p className="text-red-600 text-sm mt-1">{analysisError}</p>
                <button
                  onClick={() => setAnalysisError('')}
                  className="text-red-600 text-sm underline mt-2 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
