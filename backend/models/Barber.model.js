import mongoose from 'mongoose';

const barberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    specialization: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      default: 0,
    },
    certificate: {
      url: String,
      verified: {
        type: Boolean,
        default: false,
      },
      aiVerification: {
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        confidence: Number,
        extractedText: String,
        verifiedAt: Date,
      },
    },
    workingHours: {
      monday: { start: String, end: String, isWorking: Boolean },
      tuesday: { start: String, end: String, isWorking: Boolean },
      wednesday: { start: String, end: String, isWorking: Boolean },
      thursday: { start: String, end: String, isWorking: Boolean },
      friday: { start: String, end: String, isWorking: Boolean },
      saturday: { start: String, end: String, isWorking: Boolean },
      sunday: { start: String, end: String, isWorking: Boolean },
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
  },
  {
    timestamps: true,
  }
);

barberSchema.index({ salonId: 1 });
barberSchema.index({ status: 1 });

export default mongoose.model('Barber', barberSchema);
