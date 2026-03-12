import mongoose from 'mongoose';

const styleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['hairstyle', 'beard'],
    required: true
  },
  suitableFaceShapes: [{
    type: String,
    enum: ['oval', 'round', 'square', 'heart', 'diamond', 'oblong']
  }],
  images: [{
    type: String,
    required: true
  }],
  overlayImage: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  popularity: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  tags: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    min: 0
  },
  duration: {
    type: Number, // in minutes
    min: 15
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  maintenance: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  seasons: [{
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter']
  }],
  ageGroups: [{
    type: String,
    enum: ['teen', 'young-adult', 'adult', 'mature']
  }],
  hairTypes: [{
    type: String,
    enum: ['straight', 'wavy', 'curly', 'coily']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

styleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
styleSchema.index({ category: 1, suitableFaceShapes: 1, popularity: -1 });
styleSchema.index({ tags: 1 });
styleSchema.index({ isActive: 1 });

export default mongoose.model('Style', styleSchema);
