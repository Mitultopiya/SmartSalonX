import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['certificate_approved', 'appointment_reminder', 'system', 'info', 'warning', 'success'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedModel',
    },
    relatedModel: {
      type: String,
      enum: ['Barber', 'Appointment', 'User'],
    },
    actionUrl: {
      type: String, // URL to redirect when clicked
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Additional data
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
