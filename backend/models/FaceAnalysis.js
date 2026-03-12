const mongoose = require('mongoose');

const faceAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  faceShape: {
    type: String,
    enum: ['oval', 'round', 'square', 'heart', 'diamond', 'oblong'],
    required: true
  },
  measurements: {
    faceLength: { type: Number, required: true },
    jawline: { type: Number, required: true },
    foreheadWidth: { type: Number, required: true },
    cheekboneWidth: { type: Number, required: true },
    faceWidth: { type: Number, required: true }
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  images: {
    front: String,
    left: String,
    right: String
  },
  recommendations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Style'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

faceAnalysisSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FaceAnalysis', faceAnalysisSchema);
