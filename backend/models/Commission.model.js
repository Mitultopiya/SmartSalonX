import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barber',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    commissionRate: {
      type: Number,
      default: 0.1,
    },
    status: {
      type: String,
      enum: ['blocked', 'released'],
      default: 'blocked',
    },
    releasedAt: Date,
    settlementPeriod: {
      startDate: Date,
      endDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

commissionSchema.index({ barberId: 1, status: 1 });
commissionSchema.index({ appointmentId: 1 });

export default mongoose.model('Commission', commissionSchema);
