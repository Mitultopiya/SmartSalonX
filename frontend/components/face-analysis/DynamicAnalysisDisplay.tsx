'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, Zap, BarChart3, Eye } from 'lucide-react';

interface FaceAnalysisResult {
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong';
  measurements: any;
  confidence: number;
  landmarks: any;
  faceId?: string;
  analysisDetails?: {
    detectedFeatures: string[];
    uniqueCharacteristics: string[];
    recommendations: string[];
  };
}

interface DynamicAnalysisDisplayProps {
  analysis: FaceAnalysisResult | null;
  isAnalyzing?: boolean;
}

export default function DynamicAnalysisDisplay({ analysis, isAnalyzing = false }: DynamicAnalysisDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (isAnalyzing) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
          <h3 className="font-semibold text-blue-800">Dynamic Analysis in Progress...</h3>
        </div>
        <p className="text-blue-700 text-sm">Analyzing unique facial features and image properties...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Awaiting Analysis</h3>
        </div>
        <p className="text-gray-600 text-sm">Upload a photo to see unique face analysis results.</p>
      </div>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getShapeIcon = (shape: string) => {
    const icons = {
      oval: '⭕',
      round: '🔵',
      square: '⬜',
      heart: '❤️',
      diamond: '💎',
      oblong: '▭'
    };
    return icons[shape as keyof typeof icons] || '❓';
  };

  const getShapeColor = (shape: string) => {
    const colors = {
      oval: 'bg-blue-100 text-blue-800 border-blue-200',
      round: 'bg-green-100 text-green-800 border-green-200',
      square: 'bg-purple-100 text-purple-800 border-purple-200',
      heart: 'bg-pink-100 text-pink-800 border-pink-200',
      diamond: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      oblong: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[shape as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-4">
      {/* Main Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Dynamic Analysis Results
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceColor(analysis.confidence)}`}>
            {(analysis.confidence * 100).toFixed(1)}% Confidence
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`text-center p-3 rounded-lg border ${getShapeColor(analysis.faceShape)}`}>
            <div className="text-2xl mb-1">{getShapeIcon(analysis.faceShape)}</div>
            <div className="font-semibold capitalize">{analysis.faceShape}</div>
            <div className="text-xs">Detected Shape</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="text-2xl mb-1">📏</div>
            <div className="font-semibold text-blue-800">
              {analysis.measurements.widthToHeightRatio?.toFixed(3)}
            </div>
            <div className="text-xs text-blue-600">Width/Height Ratio</div>
          </div>
        </div>

        {/* Key Measurements */}
        <div className="grid grid-cols-3 gap-2 text-xs mb-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium text-gray-800">Width</div>
            <div className="text-gray-600">{analysis.measurements.faceWidth?.toFixed(0)}px</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium text-gray-800">Height</div>
            <div className="text-gray-600">{analysis.measurements.faceHeight?.toFixed(0)}px</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium text-gray-800">Area</div>
            <div className="text-gray-600">{(analysis.measurements.faceArea / 1000).toFixed(1)}Kpx²</div>
          </div>
        </div>

        {/* Unique Characteristics */}
        {analysis.analysisDetails?.uniqueCharacteristics && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Unique Characteristics
            </h4>
            <div className="flex flex-wrap gap-1">
              {analysis.analysisDetails.uniqueCharacteristics.map((char, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                  {char}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
        >
          <BarChart3 className="w-4 h-4" />
          {showDetails ? 'Hide' : 'Show'} Detailed Analysis
        </button>
      </div>

      {/* Detailed Analysis */}
      {showDetails && (
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold">COMPLETE ANALYSIS DATA</span>
          </div>
          
          <div className="space-y-3">
            {/* Basic Info */}
            <div>
              <div className="text-yellow-400 font-semibold mb-1">BASIC INFORMATION</div>
              <div className="text-gray-300">
                Face Shape: {analysis.faceShape}<br/>
                Confidence: {(analysis.confidence * 100).toFixed(1)}%<br/>
                Face ID: {analysis.faceId}<br/>
                Asymmetry Score: {(analysis.measurements.asymmetryScore * 100).toFixed(1)}%
              </div>
            </div>

            {/* Measurements */}
            <div>
              <div className="text-yellow-400 font-semibold mb-1">PRECISE MEASUREMENTS</div>
              <div className="text-gray-300">
                Face Width: {analysis.measurements.faceWidth?.toFixed(2)}px<br/>
                Face Height: {analysis.measurements.faceHeight?.toFixed(2)}px<br/>
                Jawline Width: {analysis.measurements.jawlineWidth?.toFixed(2)}px<br/>
                Forehead Width: {analysis.measurements.foreheadWidth?.toFixed(2)}px<br/>
                Cheekbone Width: {analysis.measurements.cheekboneWidth?.toFixed(2)}px<br/>
                Eye Spacing: {analysis.measurements.eyeSpacing?.toFixed(2)}px<br/>
                Nose Width: {analysis.measurements.noseWidth?.toFixed(2)}px<br/>
                Mouth Width: {analysis.measurements.mouthWidth?.toFixed(2)}px<br/>
                Chin Prominence: {analysis.measurements.chinProminence?.toFixed(3)}<br/>
                Forehead Height: {analysis.measurements.foreheadHeight?.toFixed(2)}px
              </div>
            </div>

            {/* Ratios */}
            <div>
              <div className="text-yellow-400 font-semibold mb-1">FACIAL RATIOS</div>
              <div className="text-gray-300">
                Width/Height: {analysis.measurements.widthToHeightRatio?.toFixed(4)}<br/>
                Jawline/Forehead: {analysis.measurements.jawlineToForeheadRatio?.toFixed(4)}<br/>
                Jaw/Cheek: {analysis.measurements.jawToCheekRatio?.toFixed(4)}
              </div>
            </div>

            {/* Image Properties */}
            {analysis.landmarks?.imageProperties && (
              <div>
                <div className="text-yellow-400 font-semibold mb-1">IMAGE ANALYSIS</div>
                <div className="text-gray-300">
                  Avg Brightness: {analysis.landmarks.imageProperties.avgBrightness?.toFixed(2)}<br/>
                  Skin Tone Ratio: {(analysis.landmarks.imageProperties.skinToneRatio * 100).toFixed(1)}%<br/>
                  Edge Density: {(analysis.landmarks.imageProperties.edgeDensity * 100).toFixed(1)}%<br/>
                  Edge Direction: {(analysis.landmarks.imageProperties.edgeDirectionRatio * 100).toFixed(1)}% vertical
                </div>
              </div>
            )}

            {/* Detected Features */}
            {analysis.landmarks?.detectedFeatures && (
              <div>
                <div className="text-yellow-400 font-semibold mb-1">DETECTED FEATURES</div>
                <div className="text-gray-300">
                  {analysis.landmarks.detectedFeatures.join('<br/>')}
                </div>
              </div>
            )}

            {/* Analysis Reasons */}
            {analysis.landmarks?.analysisReasons && (
              <div>
                <div className="text-yellow-400 font-semibold mb-1">CLASSIFICATION REASONS</div>
                <div className="text-gray-300">
                  {analysis.landmarks.analysisReasons.join('<br/>')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Analysis Summary
        </h4>
        <div className="text-sm text-green-700 space-y-1">
          <p>✓ Each photo receives unique measurements based on actual image properties</p>
          <p>✓ Analysis considers brightness, edges, skin tones, and facial proportions</p>
          <p>✓ Results vary based on individual facial characteristics</p>
          <p>✓ No static or predetermined values - truly dynamic analysis</p>
        </div>
      </div>
    </div>
  );
}
