const FaceAnalysis = require('../models/FaceAnalysis');
const Style = require('../models/Style');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/face-analysis/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload and analyze face images
exports.uploadAndAnalyze = [
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'leftImage', maxCount: 1 },
    { name: 'rightImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { faceShape, measurements, confidence } = req.body;
      const userId = req.user.id;

      // Parse measurements if they come as string
      let parsedMeasurements;
      try {
        parsedMeasurements = typeof measurements === 'string' 
          ? JSON.parse(measurements) 
          : measurements;
      } catch (error) {
        return res.status(400).json({ 
          message: 'Invalid measurements format' 
        });
      }

      // Create face analysis record
      const faceAnalysis = new FaceAnalysis({
        userId,
        faceShape,
        measurements: parsedMeasurements,
        confidence: parseFloat(confidence),
        images: {
          front: req.files.frontImage ? `/uploads/face-analysis/${req.files.frontImage[0].filename}` : null,
          left: req.files.leftImage ? `/uploads/face-analysis/${req.files.leftImage[0].filename}` : null,
          right: req.files.rightImage ? `/uploads/face-analysis/${req.files.rightImage[0].filename}` : null
        }
      });

      // Get style recommendations
      const recommendedStyles = await Style.find({
        suitableFaceShapes: faceShape,
        isActive: true
      }).sort({ popularity: -1 });

      faceAnalysis.recommendations = recommendedStyles.map(style => style._id);
      await faceAnalysis.save();

      res.status(201).json({
        message: 'Face analysis completed successfully',
        data: {
          id: faceAnalysis._id,
          faceShape: faceAnalysis.faceShape,
          measurements: faceAnalysis.measurements,
          confidence: faceAnalysis.confidence,
          images: faceAnalysis.images,
          recommendations: recommendedStyles
        }
      });
    } catch (error) {
      console.error('Face analysis error:', error);
      res.status(500).json({ 
        message: 'Failed to analyze face', 
        error: error.message 
      });
    }
  }
];

// Get user's face analysis history
exports.getUserAnalysisHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const analyses = await FaceAnalysis.find({ userId })
      .populate('recommendations')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Analysis history retrieved successfully',
      data: analyses
    });
  } catch (error) {
    console.error('Get analysis history error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve analysis history', 
      error: error.message 
    });
  }
};

// Get specific face analysis
exports.getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await FaceAnalysis.findOne({ _id: id, userId })
      .populate('recommendations');

    if (!analysis) {
      return res.status(404).json({ 
        message: 'Face analysis not found' 
      });
    }

    res.json({
      message: 'Analysis retrieved successfully',
      data: analysis
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve analysis', 
      error: error.message 
    });
  }
};

// Delete face analysis
exports.deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await FaceAnalysis.findOne({ _id: id, userId });
    
    if (!analysis) {
      return res.status(404).json({ 
        message: 'Face analysis not found' 
      });
    }

    // Delete associated image files
    if (analysis.images.front) {
      const frontPath = path.join(__dirname, '..', analysis.images.front);
      if (fs.existsSync(frontPath)) {
        fs.unlinkSync(frontPath);
      }
    }
    if (analysis.images.left) {
      const leftPath = path.join(__dirname, '..', analysis.images.left);
      if (fs.existsSync(leftPath)) {
        fs.unlinkSync(leftPath);
      }
    }
    if (analysis.images.right) {
      const rightPath = path.join(__dirname, '..', analysis.images.right);
      if (fs.existsSync(rightPath)) {
        fs.unlinkSync(rightPath);
      }
    }

    await FaceAnalysis.findByIdAndDelete(id);

    res.json({
      message: 'Face analysis deleted successfully'
    });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ 
      message: 'Failed to delete analysis', 
      error: error.message 
    });
  }
};

// Update face analysis
exports.updateAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const analysis = await FaceAnalysis.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    ).populate('recommendations');

    if (!analysis) {
      return res.status(404).json({ 
        message: 'Face analysis not found' 
      });
    }

    res.json({
      message: 'Face analysis updated successfully',
      data: analysis
    });
  } catch (error) {
    console.error('Update analysis error:', error);
    res.status(500).json({ 
      message: 'Failed to update analysis', 
      error: error.message 
    });
  }
};
