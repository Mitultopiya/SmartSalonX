import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    role: {
      type: String,
      enum: ['user', 'barber', 'admin'],
      default: 'user',
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    addresses: [
      {
        label: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
userSchema.index({ role: 1 });

export default mongoose.model('User', userSchema);
