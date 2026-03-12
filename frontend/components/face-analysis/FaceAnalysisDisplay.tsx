'use client';

import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface FaceAnalysisData {
  faceShape: string;
  measurements: {
    faceWidth: number;
    faceHeight: number;
    jawlineWidth: number;
    foreheadWidth: number;
    eyeSpacing: number;
    noseWidth: number;
    mouthWidth: number;
    widthToHeightRatio: number;
    jawlineToForeheadRatio: number;
  };
  confidence: number;
}

interface FaceAnalysisDisplayProps {
  analysis: FaceAnalysisData | null;
  isAnalyzing: boolean;
  error?: string;
}

export default function FaceAnalysisDisplay({ analysis, isAnalyzing, error }: FaceAnalysisDisplayProps) {
  const getFaceShapeDescription = (shape: string) => {
    const descriptions: Record<string, string> = {
      'oval': 'Perfectly balanced proportions - you can pull off almost any style! Your face has ideal symmetry.',
      'round': 'Soft, curved features - styles that add height and angular definition work best for your face.',
      'square': 'Strong, defined jawline - softer, textured styles help balance your angular features beautifully.',
      'heart': 'Wider forehead with narrower chin - styles that add volume at the jaw create perfect balance.',
      'diamond': 'Prominent cheekbones - side-swept and medium-length styles complement your striking features.',
      'oblong': 'Longer face shape - styles that add width and volume on the sides create ideal proportions.'
    };
    return descriptions[shape] || 'Unique face shape with specific style needs';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-dark-100 rounded-xl p-6 border border-dark-300">
      <h3 className="text-xl font-semibold mb-4 text-cyan-400">Face Analysis Results</h3>
      
      {isAnalyzing && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-gray-300">Analyzing facial features...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg mb-4">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {analysis && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Face Shape Result */}
          <div className="bg-dark-200/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">Face Shape</h4>
              <span className={`text-sm font-medium ${getConfidenceColor(analysis.confidence)}`}>
                {(analysis.confidence * 100).toFixed(1)}% confidence
              </span>
            </div>
            <div className="text-2xl font-bold text-cyan-400 capitalize mb-2">
              {analysis.faceShape} Face
            </div>
            <p className="text-gray-300 text-sm">
              {getFaceShapeDescription(analysis.faceShape)}
            </p>
          </div>

          {/* Measurements Display */}
          <div className="bg-dark-200/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-4">Facial Measurements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Face Width:</span>
                  <span className="text-white font-mono">{((analysis.measurements.faceWidth || 0) * 0.264583).toFixed(1)}cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Face Height:</span>
                  <span className="text-white font-mono">{((analysis.measurements.faceHeight || 0) * 0.264583).toFixed(1)}cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Jawline Width:</span>
                  <span className="text-white font-mono">{((analysis.measurements.jawlineWidth || 0) * 0.264583).toFixed(1)}cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Forehead Width:</span>
                  <span className="text-white font-mono">{((analysis.measurements.foreheadWidth || 0) * 0.264583).toFixed(1)}cm</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Eye Spacing:</span>
                  <span className="text-white font-mono">{((analysis.measurements.eyeSpacing || 0) * 0.264583).toFixed(1)}cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Nose Width:</span>
                  <span className="text-white font-mono">{((analysis.measurements.noseWidth || 0) * 0.264583).toFixed(1)}cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mouth Width:</span>
                  <span className="text-white font-mono">{((analysis.measurements.mouthWidth || 0) * 0.264583).toFixed(1)}cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ratios */}
          <div className="bg-dark-200/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-4">Facial Ratios</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Width to Height Ratio:</span>
                  <span className="text-white font-mono">{(analysis.measurements.widthToHeightRatio || 0).toFixed(2)}</span>
                </div>
                <div className="w-full bg-dark-300 rounded-full h-2">
                  <div 
                    className="bg-cyan-400 h-2 rounded-full" 
                    style={{ width: `${Math.min((analysis.measurements.widthToHeightRatio || 0) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Jawline to Forehead Ratio:</span>
                  <span className="text-white font-mono">{(analysis.measurements.jawlineToForeheadRatio || 0).toFixed(2)}</span>
                </div>
                <div className="w-full bg-dark-300 rounded-full h-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full" 
                    style={{ width: `${Math.min((analysis.measurements.jawlineToForeheadRatio || 0) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Quality */}
          <div className="bg-dark-200/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Analysis Quality</h4>
            <div className="flex items-center">
              <CheckCircle className={`h-5 w-5 mr-2 ${getConfidenceColor(analysis.confidence)}`} />
              <span className="text-gray-300">
                {analysis.confidence >= 0.9 ? 'Excellent quality - Highly accurate recommendations' :
                 analysis.confidence >= 0.7 ? 'Good quality - Reliable recommendations' :
                 'Fair quality - Recommendations may vary'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
