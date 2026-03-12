// Style Learning System - Learns from user preferences over time

interface UserPreference {
  styleId: string;
  faceShape: string;
  selected: boolean;
  timestamp: number;
  category: 'hairstyle' | 'beard';
  type: 'short' | 'medium' | 'long' | 'professional' | 'trendy';
}

interface StyleScore {
  styleId: string;
  score: number;
  confidence: number;
  reasons: string[];
}

class StyleLearningSystem {
  private preferences: UserPreference[] = [];
  private styleScores: Map<string, StyleScore> = new Map();

  constructor() {
    this.loadPreferences();
  }

  // Load user preferences from localStorage
  private loadPreferences() {
    try {
      const stored = localStorage.getItem('stylePreferences');
      if (stored) {
        this.preferences = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }

  // Save preferences to localStorage
  private savePreferences() {
    try {
      localStorage.setItem('stylePreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  // Record user interaction with a style
  recordInteraction(styleId: string, faceShape: string, selected: boolean, category: 'hairstyle' | 'beard', type: 'short' | 'medium' | 'long' | 'professional' | 'trendy') {
    const preference: UserPreference = {
      styleId,
      faceShape,
      selected,
      timestamp: Date.now(),
      category,
      type
    };

    this.preferences.push(preference);
    this.updateStyleScores();
    this.savePreferences();
  }

  // Update style scores based on user preferences
  private updateStyleScores() {
    const styleInteractions = new Map<string, UserPreference[]>();
    
    // Group interactions by style
    this.preferences.forEach(pref => {
      if (!styleInteractions.has(pref.styleId)) {
        styleInteractions.set(pref.styleId, []);
      }
      styleInteractions.get(pref.styleId)!.push(pref);
    });

    // Calculate scores for each style
    styleInteractions.forEach((interactions, styleId) => {
      const score = this.calculateStyleScore(interactions);
      const confidence = this.calculateConfidence(interactions);
      const reasons = this.generateReasons(interactions);

      this.styleScores.set(styleId, {
        styleId,
        score,
        confidence,
        reasons
      });
    });
  }

  // Calculate style score based on user interactions
  private calculateStyleScore(interactions: UserPreference[]): number {
    const recentInteractions = interactions.filter(i => 
      Date.now() - i.timestamp < 30 * 24 * 60 * 60 * 1000 // Last 30 days
    );

    if (recentInteractions.length === 0) return 0.5; // Neutral score

    const selectedCount = recentInteractions.filter(i => i.selected).length;
    const totalCount = recentInteractions.length;
    
    // Base score from selection rate
    let score = selectedCount / totalCount;

    // Boost score for recent selections
    const recentSelected = recentInteractions
      .filter(i => i.selected)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5); // Last 5 selections

    if (recentSelected.length > 0) {
      score += 0.2 * (recentSelected.length / 5);
    }

    // Apply face shape learning
    const faceShapeConsistency = this.calculateFaceShapeConsistency(recentInteractions);
    score += 0.1 * faceShapeConsistency;

    return Math.min(Math.max(score, 0), 1); // Clamp between 0 and 1
  }

  // Calculate confidence in the score
  private calculateConfidence(interactions: UserPreference[]): number {
    const totalInteractions = interactions.length;
    if (totalInteractions < 3) return 0.1; // Low confidence with few interactions
    if (totalInteractions < 10) return 0.5; // Medium confidence
    return Math.min(0.9, totalInteractions / 20); // High confidence with many interactions
  }

  // Calculate face shape consistency
  private calculateFaceShapeConsistency(interactions: UserPreference[]): number {
    const faceShapes = interactions.map(i => i.faceShape);
    const shapeCounts = new Map<string, number>();
    
    faceShapes.forEach(shape => {
      shapeCounts.set(shape, (shapeCounts.get(shape) || 0) + 1);
    });

    const maxCount = Math.max(...Array.from(shapeCounts.values()));
    return maxCount / faceShapes.length;
  }

  // Generate reasons for style recommendations
  private generateReasons(interactions: UserPreference[]): string[] {
    const reasons: string[] = [];
    
    const selectedInteractions = interactions.filter(i => i.selected);
    const totalCount = interactions.length;
    const selectedCount = selectedInteractions.length;

    if (selectedCount / totalCount > 0.7) {
      reasons.push('Frequently selected by you');
    }

    const recentSelected = selectedInteractions
      .filter(i => Date.now() - i.timestamp < 7 * 24 * 60 * 60 * 1000)
      .length;

    if (recentSelected > 0) {
      reasons.push('Recently popular with you');
    }

    const categories = Array.from(new Set(selectedInteractions.map(i => i.category)));
    if (categories.length === 1) {
      reasons.push(`Matches your ${categories[0]} preferences`);
    }

    const types = Array.from(new Set(selectedInteractions.map(i => i.type)));
    if (types.length === 1) {
      reasons.push(`Fits your ${types[0]} style preference`);
    }

    return reasons;
  }

  // Get enhanced recommendations based on learning
  getEnhancedRecommendations(
    faceShape: string, 
    baseRecommendations: any[], 
    category?: 'hairstyle' | 'beard'
  ): any[] {
    // Add learning scores to base recommendations
    const enhancedRecommendations = baseRecommendations.map(style => {
      const learningScore = this.styleScores.get(style.id);
      const baseScore = style.popularity / 100; // Convert popularity to 0-1 scale
      
      let finalScore = baseScore;
      let learningReasons: string[] = [];

      if (learningScore) {
        // Combine base score with learning score (70% base, 30% learning)
        finalScore = (baseScore * 0.7) + (learningScore.score * 0.3 * learningScore.confidence);
        learningReasons = learningScore.reasons;
      }

      return {
        ...style,
        learningScore: finalScore,
        learningReasons,
        confidence: learningScore?.confidence || 0
      };
    });

    // Sort by enhanced score
    return enhancedRecommendations.sort((a, b) => b.learningScore - a.learningScore);
  }

  // Get user style profile
  getUserProfile() {
    const recentInteractions = this.preferences.filter(i => 
      Date.now() - i.timestamp < 60 * 24 * 60 * 60 * 1000 // Last 60 days
    );

    if (recentInteractions.length === 0) {
      return {
        experience: 'new',
        preferences: {},
        insights: ['Start exploring different styles to build your profile']
      };
    }

    const selectedInteractions = recentInteractions.filter(i => i.selected);
    const categories = Array.from(new Set(selectedInteractions.map(i => i.category)));
    const types = Array.from(new Set(selectedInteractions.map(i => i.type)));

    return {
      experience: recentInteractions.length > 20 ? 'experienced' : 'developing',
      preferences: {
        categories,
        types,
        favoriteCount: selectedInteractions.length,
        totalInteractions: recentInteractions.length
      },
      insights: this.generateInsights(selectedInteractions)
    };
  }

  // Generate user insights
  private generateInsights(interactions: UserPreference[]): string[] {
    const insights: string[] = [];
    
    const categories = Array.from(new Set(interactions.map(i => i.category)));
    if (categories.length === 1) {
      insights.push(`You prefer ${categories[0]} styles`);
    }

    const types = Array.from(new Set(interactions.map(i => i.type)));
    if (types.length === 1 && types[0] === 'professional') {
      insights.push('You prefer professional styles');
    } else if (types.length === 1 && types[0] === 'trendy') {
      insights.push('You like trendy and fashionable styles');
    }

    return insights;
  }
}

// Export singleton instance
export const styleLearning = new StyleLearningSystem();
