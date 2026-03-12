'use client';

import { useRef, useState, useEffect } from 'react';
import { Camera, Download, Share2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

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
  overlayImage?: string;
}

interface VirtualTryOnProps {
  userImage: string;
  selectedStyle: Style;
  onClose: () => void;
  onSaveStyle: (styleData: string) => void;
}

export default function VirtualTryOn({ 
  userImage, 
  selectedStyle, 
  onClose, 
  onSaveStyle 
}: VirtualTryOnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [styleOpacity, setStyleOpacity] = useState(0.8);

  useEffect(() => {
    renderComposite();
  }, [userImage, selectedStyle, scale, position, styleOpacity]);

  const renderComposite = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsProcessing(true);

    try {
      // Set canvas size
      canvas.width = 600;
      canvas.height = 600;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw user image
      const userImg = new Image();
      userImg.onload = () => {
        // Scale and center user image
        const scale = Math.min(canvas.width / userImg.width, canvas.height / userImg.height);
        const x = (canvas.width - userImg.width * scale) / 2;
        const y = (canvas.height - userImg.height * scale) / 2;
        
        ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

        // Apply style overlay
        if (selectedStyle.overlayImage) {
          const styleImg = new Image();
          styleImg.onload = () => {
            ctx.globalAlpha = styleOpacity;
            
            const styleScale = scale * scale;
            const styleX = x + position.x;
            const styleY = y + position.y;
            
            ctx.drawImage(
              styleImg, 
              styleX, 
              styleY, 
              styleImg.width * styleScale, 
              styleImg.height * styleScale
            );
            
            ctx.globalAlpha = 1;
            setIsProcessing(false);
          };
          styleImg.src = selectedStyle.overlayImage;
        } else {
          // Create a simple overlay effect if no overlay image
          ctx.globalAlpha = styleOpacity * 0.3;
          ctx.fillStyle = selectedStyle.category === 'hairstyle' ? '#8B4513' : '#000000';
          
          // Draw a simple shape overlay based on category
          if (selectedStyle.category === 'hairstyle') {
            // Draw hair shape on top
            ctx.beginPath();
            ctx.ellipse(canvas.width / 2, 150, 120, 80, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Draw beard shape on bottom
            ctx.beginPath();
            ctx.ellipse(canvas.width / 2, 450, 80, 60, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.globalAlpha = 1;
          setIsProcessing(false);
        }
      };
      userImg.src = userImage;
    } catch (error) {
      console.error('Error rendering composite:', error);
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL('image/png');
      onSaveStyle(imageData);
    }
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'style-try-on.png', { type: 'image/png' });
          
          if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: 'My New Style',
                text: `Check out how I look with ${selectedStyle.name}!`,
                files: [file]
              });
            } catch (error) {
              console.log('Share cancelled or failed:', error);
            }
          } else {
            // Fallback: download the image
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'style-try-on.png';
            a.click();
            URL.revokeObjectURL(url);
          }
        }
      });
    }
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setStyleOpacity(0.8);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Virtual Try-On</h3>
              <p className="text-gray-600">See how you look with {selectedStyle.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto max-w-full"
                  style={{ maxHeight: '600px' }}
                />
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p>Processing...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Adjustments</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Size</label>
                    <div className="flex gap-2">
                      <button
                        onClick={handleZoomOut}
                        className="flex-1 p-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <ZoomOut className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={handleZoomIn}
                        className="flex-1 p-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <ZoomIn className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Opacity: {Math.round(styleOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={styleOpacity * 100}
                      onChange={(e) => setStyleOpacity(Number(e.target.value) / 100)}
                      className="w-full"
                    />
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Style Details</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedStyle.name}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {selectedStyle.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Save Look
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
