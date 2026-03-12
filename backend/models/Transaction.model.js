import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    provider: {
      // For simulation now; can be swapped for real gateway later
      type: String,
      default: 'SIMULATED_UPI',
    },
    idempotencyKey: {
      type: String,
      index: true,
    },
    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

transactionSchema.index({ appointmentId: 1, status: 1 });

export default mongoose.model('Transaction', transactionSchema);

