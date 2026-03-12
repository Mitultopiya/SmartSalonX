'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, X, Star, Clock, DollarSign, Brain } from 'lucide-react';
import { styleLearning } from '@/lib/styleLearning';
import StyleImage from './StyleImage';
import { localHairstyles, localBeardStyles, fallbackStyleImages } from '@/styles/hairstyles';

interface Style {
  id: string;
  name: string;
  category: 'hairstyle' | 'beard';
  type: 'short' | 'medium' | 'long' | 'professional' | 'trendy';
  imageUrl: string;
  description: string;
  price: number;
  duration: number;
  popularity: number;
  compatibleFaceShapes: string[];
}

interface StyleGalleryProps {
  faceShape: string;
  selectedStyles: Style[];
  onStyleSelect: (style: Style) => void;
  onStyleRemove: (styleId: string) => void;
}

export default function StyleGallery({ faceShape, selectedStyles, onStyleSelect, onStyleRemove }: StyleGalleryProps) {
  const [recommendedStyles, setRecommendedStyles] = useState<Style[]>([]);
  const [allStyles, setAllStyles] = useState<Style[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStyles();
  }, [faceShape]);

  const handleStyleSelect = (style: Style) => {
    // Record user interaction for learning
    styleLearning.recordInteraction(
      style.id,
      faceShape,
      true, // selected
      style.category,
      style.type
    );

    onStyleSelect(style);
  };

  const loadStyles = async () => {
    setLoading(true);
    try {
      // Use local styles instead of external URLs
      const styles = [...localHairstyles, ...localBeardStyles];
      
      setAllStyles(styles);
      
      // Filter recommended styles based on face shape
      const recommended = styles
        .filter(style => style.compatibleFaceShapes.includes(faceShape))
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 6);
      
      // Apply learning system to enhance recommendations
      const enhancedRecommended = styleLearning.getEnhancedRecommendations(
        faceShape, 
        recommended, 
        undefined // No category filter for now
      );
      
      setRecommendedStyles(enhancedRecommended);
    } catch (error) {
      console.error('Error loading styles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStyles = allStyles.filter(style =>
    style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    style.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotalBill = () => {
    return selectedStyles.reduce((total, style) => total + style.price, 0);
  };

  const calculateTotalDuration = () => {
    return selectedStyles.reduce((total, style) => total + style.duration, 0);
  };

  return (
    <div className="space-y-6">
      {/* Selected Styles Summary */}
      {selectedStyles.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-xl p-6 border border-cyan-500/30">
          <h3 className="text-xl font-semibold mb-4 text-cyan-400">Selected Styles</h3>
          <div className="space-y-3 mb-4">
            {selectedStyles.map((style) => (
              <div key={style.id} className="flex items-center justify-between bg-dark-200/50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <StyleImage 
                    src={style.imageUrl} 
                    alt={style.name} 
                    className="w-12 h-12 rounded-lg object-cover"
                    fallbackText={style.name}
                  />
                  <div>
                    <h4 className="font-medium text-white">{style.name}</h4>
                    <p className="text-sm text-gray-400">{style.type} • {style.duration}min</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400 font-semibold">₹{style.price}</span>
                  <button
                    onClick={() => onStyleRemove(style.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-dark-300">
            <div>
              <p className="text-gray-400 text-sm">Total Duration: {calculateTotalDuration()} minutes</p>
              <p className="text-2xl font-bold text-cyan-400">Total Bill: ₹{calculateTotalBill()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Styles */}
      <div className="bg-dark-100 rounded-xl p-6 border border-dark-300">
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">Top 6 Recommended Styles for {faceShape} Face</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedStyles.map((style) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-dark-200/50 rounded-lg overflow-hidden border border-dark-300 hover:border-cyan-500/50 transition-all cursor-pointer"
                onClick={() => onStyleSelect(style)}
              >
                <div className="relative">
                  <StyleImage 
                    src={style.imageUrl} 
                    alt={style.name}
                    className="w-full h-48 object-cover"
                    fallbackText={`${style.name} - ${style.type}`}
                  />
                  <div className="absolute top-2 right-2 bg-cyan-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {style.popularity}% Match
                  </div>
                  <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {style.type}
                  </div>
                  {/* Learning indicator */}
                  {(style as any).learningReasons && (style as any).learningReasons.length > 0 && (
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      AI Enhanced
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-1">{style.name}</h4>
                  <p className="text-gray-400 text-sm mb-3">{style.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-cyan-400 font-semibold">₹{style.price}</span>
                      <span className="text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {style.duration}min
                      </span>
                    </div>
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* All Styles with Search */}
      <div className="bg-dark-100 rounded-xl p-6 border border-dark-300">
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">Browse All Styles</h3>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search styles by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStyles.map((style) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-dark-200/50 rounded-lg overflow-hidden border border-dark-300 hover:border-cyan-500/50 transition-all cursor-pointer"
              onClick={() => onStyleSelect(style)}
            >
              <div className="relative">
                <StyleImage 
                  src={style.imageUrl} 
                  alt={style.name}
                  className="w-full h-48 object-cover"
                  fallbackText={`${style.name} - ${style.type}`}
                />
                <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {style.type}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white mb-1">{style.name}</h4>
                <p className="text-gray-400 text-sm mb-3">{style.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-cyan-400 font-semibold">₹{style.price}</span>
                    <span className="text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {style.duration}min
                    </span>
                  </div>
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
