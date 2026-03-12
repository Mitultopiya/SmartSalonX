'use client';

import { useState, useEffect } from 'react';
import { Star, Heart, Share2, Calendar, ChevronRight } from 'lucide-react';
import { getHairstylesForFaceShape, getBeardsForFaceShape, StyleData } from '../../data/faceShapeStyles';
import { getAllWomenStylesForFaceShape, WomenStyleData } from '../../data/womenFaceShapeStyles';

interface FaceAnalysisResult {
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong';
  measurements: any;
  confidence: number;
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

interface StyleRecommendationsProps {
  faceAnalysis: FaceAnalysisResult;
  onSelectStyle: (style: Style) => void;
  onBookAppointment: (style: Style) => void;
  gender?: 'male' | 'female';
}

export default function StyleRecommendations({ 
  faceAnalysis, 
  onSelectStyle, 
  onBookAppointment,
  gender = 'male'
}: StyleRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Style[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hairstyle' | 'beard' | 'treatment' | 'coloring' | 'styling'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get static styles based on face shape and gender
        let allStyles: Style[] = [];
        
        if (gender === 'female') {
          // Get women's styles
          const womenStyles = getAllWomenStylesForFaceShape(faceAnalysis.faceShape);
          allStyles = womenStyles.map((style: WomenStyleData) => ({
            _id: style.id,
            name: style.name,
            category: style.category,
            suitableFaceShapes: [faceAnalysis.faceShape],
            images: [style.image],
            description: style.description,
            popularity: parseInt(style.suitability) || 85,
            tags: style.tags,
            price: style.price,
            duration: style.duration,
            difficulty: style.difficulty,
            maintenance: style.maintenance,
            suitability: style.suitability,
            whyItWorks: style.whyItWorks
          }));
        } else {
          // Get men's styles
          const hairstyles = getHairstylesForFaceShape(faceAnalysis.faceShape);
          const beards = getBeardsForFaceShape(faceAnalysis.faceShape);
          
          allStyles = [
            ...hairstyles.map((style: StyleData) => ({
              _id: style.id,
              name: style.name,
              category: style.category,
              suitableFaceShapes: [faceAnalysis.faceShape],
              images: [style.image],
              description: style.description,
              popularity: parseInt(style.suitability) || 85,
              tags: style.tags,
              price: style.price,
              duration: style.duration,
              difficulty: style.difficulty,
              maintenance: style.maintenance,
              suitability: style.suitability,
              whyItWorks: style.whyItWorks
            })),
            ...beards.map((style: StyleData) => ({
              _id: style.id,
              name: style.name,
              category: style.category,
              suitableFaceShapes: [faceAnalysis.faceShape],
              images: [style.image],
              description: style.description,
              popularity: parseInt(style.suitability) || 85,
              tags: style.tags,
              price: style.price,
              duration: style.duration,
              difficulty: style.difficulty,
              maintenance: style.maintenance,
              suitability: style.suitability,
              whyItWorks: style.whyItWorks
            }))
          ];
        }
        
        // Sort by suitability (popularity)
        const sortedStyles = allStyles.sort((a, b) => b.popularity - a.popularity);
        setRecommendations(sortedStyles);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [faceAnalysis.faceShape]);

  const filteredRecommendations = recommendations.filter(style => 
    selectedCategory === 'all' || style.category === selectedCategory
  );

  const getFaceShapeDescription = () => {
    const descriptions = {
      oval: 'Perfectly balanced proportions - you can pull off almost any style! Your face has ideal symmetry.',
      round: 'Soft, curved features - styles that add height and angular definition work best for your face.',
      square: 'Strong, defined jawline - softer, textured styles help balance your angular features beautifully.',
      heart: 'Wider forehead with narrower chin - styles that add volume at the jaw create perfect balance.',
      diamond: 'Prominent cheekbones - side-swept and medium-length styles complement your striking features.',
      oblong: 'Longer face shape - styles that add width and volume on the sides create ideal proportions.'
    };
    return descriptions[faceAnalysis.faceShape];
  };

  const getFaceShapeIcon = () => {
    const icons = {
      oval: '⭕',
      round: '🔵',
      square: '⬜',
      heart: '❤️',
      diamond: '💎',
      oblong: '▭'
    };
    return icons[faceAnalysis.faceShape];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Finding perfect styles for your face shape...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">❌</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Style Recommendations
        </h3>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getFaceShapeIcon()}</span>
            <div>
              <p className="font-semibold text-gray-800 capitalize">
                {faceAnalysis.faceShape} Face Shape
              </p>
              <p className="text-sm text-gray-600">
                {getFaceShapeDescription()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {gender === 'female' ? (
            (['all', 'hairstyle', 'treatment', 'coloring', 'styling'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))
          ) : (
            (['all', 'hairstyle', 'beard'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((style) => (
          <div key={style._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={style.images[0] || '/styles/hairstyles/placeholder.svg'}
                alt={style.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const fallbackPath = gender === 'female' 
                    ? '/styles/women/placeholder.svg'
                    : style.category === 'hairstyle' 
                      ? '/styles/hairstyles/placeholder.svg' 
                      : '/styles/beards/placeholder.svg';
                  e.currentTarget.src = fallbackPath;
                }}
              />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
                {style.category === 'hairstyle' ? (gender === 'female' ? '💇‍♀️' : '💇‍♂️') : 
                 style.category === 'beard' ? '🧔‍♂️' :
                 style.category === 'treatment' ? '🧴' :
                 style.category === 'coloring' ? '🎨' :
                 style.category === 'styling' ? '✨' : '💇'} {style.category}
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-white px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium">{style.popularity}%</span>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-2">{style.name}</h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{style.description}</p>
              
              {/* Suitability Badge */}
              {style.suitability && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    ✓ {style.suitability} Match
                  </span>
                </div>
              )}
              
              {/* Why it works */}
              {style.whyItWorks && (
                <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Why it works:</strong> {style.whyItWorks}
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-1 mb-3">
                {style.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {style.price && (
                <div className="text-lg font-bold text-blue-600 mb-3">
                  ₹{style.price}
                </div>
              )}

              {style.duration && (
                <div className="text-sm text-gray-500 mb-3">
                  ⏱️ {style.duration} minutes
                </div>
              )}

              {/* Difficulty and Maintenance */}
              <div className="flex gap-2 mb-3 text-xs">
                {style.difficulty && (
                  <span className={`px-2 py-1 rounded ${
                    style.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    style.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {style.difficulty}
                  </span>
                )}
                {style.maintenance && (
                  <span className={`px-2 py-1 rounded ${
                    style.maintenance === 'low' ? 'bg-green-100 text-green-800' :
                    style.maintenance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {style.maintenance} maintenance
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelectStyle(style)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  Try On
                </button>
                <button
                  onClick={() => onBookAppointment(style)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No styles found for your face shape.</p>
        </div>
      )}
    </div>
  );
}
