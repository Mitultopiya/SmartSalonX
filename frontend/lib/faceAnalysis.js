const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const faceAnalysisAPI = {
  // Upload and analyze face images
  async analyzeFace(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/face-analysis/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to analyze face');
      }

      return await response.json();
    } catch (error) {
      console.error('Face analysis API error:', error);
      throw error;
    }
  },

  // Get user's face analysis history
  async getAnalysisHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/face-analysis/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get analysis history');
      }

      return await response.json();
    } catch (error) {
      console.error('Get analysis history API error:', error);
      throw error;
    }
  },

  // Get specific face analysis
  async getAnalysisById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/face-analysis/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get analysis');
      }

      return await response.json();
    } catch (error) {
      console.error('Get analysis API error:', error);
      throw error;
    }
  },

  // Update face analysis
  async updateAnalysis(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/face-analysis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update analysis');
      }

      return await response.json();
    } catch (error) {
      console.error('Update analysis API error:', error);
      throw error;
    }
  },

  // Delete face analysis
  async deleteAnalysis(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/face-analysis/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete analysis');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete analysis API error:', error);
      throw error;
    }
  },
};

export const styleRecommendationAPI = {
  // Get style recommendations
  async getRecommendations(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/style-recommendations?${queryString}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Get recommendations API error:', error);
      throw error;
    }
  },

  // Get style by ID
  async getStyleById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/style-recommendations/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get style');
      }

      return await response.json();
    } catch (error) {
      console.error('Get style API error:', error);
      throw error;
    }
  },

  // Search styles
  async searchStyles(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/style-recommendations/search?${queryString}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to search styles');
      }

      return await response.json();
    } catch (error) {
      console.error('Search styles API error:', error);
      throw error;
    }
  },

  // Get trending styles
  async getTrendingStyles(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/style-recommendations/trending?${queryString}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get trending styles');
      }

      return await response.json();
    } catch (error) {
      console.error('Get trending styles API error:', error);
      throw error;
    }
  },

  // Get styles by face shape
  async getStylesByFaceShape(faceShape, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/style-recommendations/face-shape/${faceShape}?${queryString}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get styles by face shape');
      }

      return await response.json();
    } catch (error) {
      console.error('Get styles by face shape API error:', error);
      throw error;
    }
  },

  // Save style preference
  async saveStylePreference(styleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/style-recommendations/preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(styleData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save style preference');
      }

      return await response.json();
    } catch (error) {
      console.error('Save style preference API error:', error);
      throw error;
    }
  },
};
