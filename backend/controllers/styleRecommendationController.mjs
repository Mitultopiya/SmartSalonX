import Style from '../models/Style.mjs';
import FaceAnalysis from '../models/FaceAnalysis.mjs';

// Get style recommendations based on face shape
export const getRecommendations = async (req, res) => {
  try {
    const { faceShape, category, limit = 20, page = 1 } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (faceShape) {
      query.suitableFaceShapes = faceShape;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    // Pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    const styles = await Style.find(query)
      .sort({ popularity: -1, createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Style.countDocuments(query);

    res.json({
      message: 'Recommendations retrieved successfully',
      data: {
        styles,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ 
      message: 'Failed to get recommendations', 
      error: error.message 
    });
  }
};

// Get style by ID
export const getStyleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const style = await Style.findOne({ _id: id, isActive: true });
    
    if (!style) {
      return res.status(404).json({ 
        message: 'Style not found' 
      });
    }

    res.json({
      message: 'Style retrieved successfully',
      data: style
    });
  } catch (error) {
    console.error('Get style error:', error);
    res.status(500).json({ 
      message: 'Failed to get style', 
      error: error.message 
    });
  }
};

// Search styles
export const searchStyles = async (req, res) => {
  try {
    const { 
      query, 
      category, 
      faceShape, 
      tags, 
      minPrice, 
      maxPrice, 
      difficulty,
      maintenance,
      seasons,
      ageGroups,
      hairTypes,
      limit = 20, 
      page = 1 
    } = req.query;

    // Build search query
    const searchQuery = { isActive: true };

    // Text search
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      searchQuery.category = category;
    }

    // Filter by face shape
    if (faceShape) {
      searchQuery.suitableFaceShapes = faceShape;
    }

    // Filter by tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      searchQuery.tags = { $in: tagArray };
    }

    // Price range
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
    }

    // Difficulty
    if (difficulty) {
      searchQuery.difficulty = difficulty;
    }

    // Maintenance level
    if (maintenance) {
      searchQuery.maintenance = maintenance;
    }

    // Seasons
    if (seasons) {
      const seasonArray = Array.isArray(seasons) ? seasons : seasons.split(',');
      searchQuery.seasons = { $in: seasonArray };
    }

    // Age groups
    if (ageGroups) {
      const ageGroupArray = Array.isArray(ageGroups) ? ageGroups : ageGroups.split(',');
      searchQuery.ageGroups = { $in: ageGroupArray };
    }

    // Hair types
    if (hairTypes) {
      const hairTypeArray = Array.isArray(hairTypes) ? hairTypes : hairTypes.split(',');
      searchQuery.hairTypes = { $in: hairTypeArray };
    }

    // Pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    const styles = await Style.find(searchQuery)
      .sort({ popularity: -1, createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Style.countDocuments(searchQuery);

    res.json({
      message: 'Search completed successfully',
      data: {
        styles,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          count: total
        },
        filters: {
          query,
          category,
          faceShape,
          tags,
          minPrice,
          maxPrice,
          difficulty,
          maintenance,
          seasons,
          ageGroups,
          hairTypes
        }
      }
    });
  } catch (error) {
    console.error('Search styles error:', error);
    res.status(500).json({ 
      message: 'Failed to search styles', 
      error: error.message 
    });
  }
};

// Get trending styles
export const getTrendingStyles = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    const query = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    const styles = await Style.find(query)
      .sort({ popularity: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      message: 'Trending styles retrieved successfully',
      data: styles
    });
  } catch (error) {
    console.error('Get trending styles error:', error);
    res.status(500).json({ 
      message: 'Failed to get trending styles', 
      error: error.message 
    });
  }
};

// Get styles by face shape (detailed recommendations)
export const getStylesByFaceShape = async (req, res) => {
  try {
    const { faceShape } = req.params;
    const { category, limit = 20 } = req.query;

    if (!['oval', 'round', 'square', 'heart', 'diamond', 'oblong'].includes(faceShape)) {
      return res.status(400).json({ 
        message: 'Invalid face shape' 
      });
    }

    const query = { 
      suitableFaceShapes: faceShape, 
      isActive: true 
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    const styles = await Style.find(query)
      .sort({ popularity: -1 })
      .limit(parseInt(limit));

    // Group by category for better organization
    const groupedStyles = styles.reduce((acc, style) => {
      if (!acc[style.category]) {
        acc[style.category] = [];
      }
      acc[style.category].push(style);
      return acc;
    }, {});

    res.json({
      message: 'Styles retrieved successfully',
      data: {
        faceShape,
        styles: groupedStyles,
        total: styles.length
      }
    });
  } catch (error) {
    console.error('Get styles by face shape error:', error);
    res.status(500).json({ 
      message: 'Failed to get styles', 
      error: error.message 
    });
  }
};

// Save user style preference
export const saveStylePreference = async (req, res) => {
  try {
    const { styleId, rating, notes } = req.body;
    const userId = req.user.id;

    // This would typically save to a UserStylePreference model
    // For now, we'll just acknowledge the preference
    const style = await Style.findById(styleId);
    
    if (!style) {
      return res.status(404).json({ 
        message: 'Style not found' 
      });
    }

    // Update popularity based on rating
    if (rating) {
      style.popularity = Math.min(100, style.popularity + (rating - 3) * 2);
      await style.save();
    }

    res.json({
      message: 'Style preference saved successfully',
      data: {
        styleId,
        rating,
        notes
      }
    });
  } catch (error) {
    console.error('Save style preference error:', error);
    res.status(500).json({ 
      message: 'Failed to save style preference', 
      error: error.message 
    });
  }
};
