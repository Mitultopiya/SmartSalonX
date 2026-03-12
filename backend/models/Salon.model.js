import mongoose from 'mongoose';

const salonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
    phone: {
      type: String,
      required: true,
    },
    email: String,
    // Used to deduplicate salons imported from Google Places
    googlePlaceId: {
      type: String,
      unique: true,
      sparse: true,
    },
    genderServices: {
      type: [String],
      enum: ['male', 'female', 'unisex'],
      default: ['unisex'],
    },
    images: [String],
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
    openingHours: {
      monday: { start: String, end: String, isOpen: Boolean },
      tuesday: { start: String, end: String, isOpen: Boolean },
      wednesday: { start: String, end: String, isOpen: Boolean },
      thursday: { start: String, end: String, isOpen: Boolean },
      friday: { start: String, end: String, isOpen: Boolean },
      saturday: { start: String, end: String, isOpen: Boolean },
      sunday: { start: String, end: String, isOpen: Boolean },
    },
    amenities: [String],
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
salonSchema.index({ 'address.coordinates': '2dsphere' });
salonSchema.index({ genderServices: 1 });
salonSchema.index({ status: 1 });
// googlePlaceId has a unique index via schema field definition above

export default mongoose.model('Salon', salonSchema);
