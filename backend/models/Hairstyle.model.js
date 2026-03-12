import mongoose from 'mongoose';

const hairstyleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: String,
    category: {
      type: String,
      enum: ['haircut', 'styling', 'coloring', 'treatment', 'facial', 'other'],
      default: 'haircut',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

hairstyleSchema.index({ gender: 1 });
hairstyleSchema.index({ isActive: 1 });

export default mongoose.model('Hairstyle', hairstyleSchema);
