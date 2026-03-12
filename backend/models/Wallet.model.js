import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    blockedCommission: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ['credit', 'debit', 'commission_block', 'commission_release', 'withdrawal'],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        description: String,
        appointmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Appointment',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Wallet', walletSchema);
