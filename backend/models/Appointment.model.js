import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barber',
      required: true,
    },
    // For backward compatibility we keep a primary hairstyleId, but
    // multi-service appointments should use the services[] array below.
    hairstyleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hairstyle',
    },
    // Multi-service booking: one barber, many services
    services: [
      {
        hairstyleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Hairstyle',
          required: true,
        },
        name: String, // snapshot of hairstyle name at booking time
        duration: Number, // minutes
        price: Number, // individual service price
      },
    ],
    appointmentDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    // Total duration of all selected services (minutes)
    duration: {
      type: Number,
      required: true,
    },
    // Total base price (sum of services before discounts)
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    rewardPointsUsed: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      // Payment-first flow:
      // PENDING_PAYMENT -> CONFIRMED -> COMPLETED
      // PENDING_PAYMENT -> CANCELLED (payment failure / user cancel)
      enum: ['PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'PENDING_PAYMENT',
      index: true,
    },
    payment: {
      status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
        default: 'PENDING',
      },
      transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
      },
      amount: Number,
      paidAt: Date,
    },
    cancellation: {
      cancelledBy: {
        type: String,
        enum: ['user', 'barber', 'admin'],
      },
      cancelledAt: Date,
      reason: String,
      refundAmount: Number,
      refundStatus: {
        type: String,
        enum: ['pending', 'processed', 'failed'],
      },
    },
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      createdAt: Date,
    },
    // Style Advisor Integration
    faceAnalysis: {
      faceShape: {
        type: String,
        enum: ['oval', 'round', 'square', 'heart', 'diamond', 'oblong']
      },
      analysisId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FaceAnalysis'
      },
      recommendedStyles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Style'
      }]
    },
    selectedStyle: {
      styleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Style'
      },
      name: String,
      category: {
        type: String,
        enum: ['hairstyle', 'beard']
      },
      virtualTryOnImage: String // URL of the virtual try-on result
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ barberId: 1, startTime: 1, endTime: 1 });
appointmentSchema.index({ salonId: 1 });
appointmentSchema.index({ 'payment.status': 1 });
appointmentSchema.index({ appointmentDate: 1 });

// Compound index for collision detection
appointmentSchema.index({ barberId: 1, startTime: 1, endTime: 1, status: 1 });

export default mongoose.model('Appointment', appointmentSchema);