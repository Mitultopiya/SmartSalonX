import Salon from '../models/Salon.model.js';

export const getSalons = async (req, res) => {
  try {
    const { gender, status, city } = req.query;
    const query = {};

    if (gender) {
      query.genderServices = { $in: [gender, 'unisex'] };
    }
    if (status) {
      query.status = status;
    }
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    const salons = await Salon.find(query)
      .populate('ownerId', 'name email phone')
      .sort({ 'rating.average': -1 });

    res.json(salons);
  } catch (error) {
    console.error('Get Salons Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getNearbySalons = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 50, gender } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const distanceKm = parseFloat(maxDistance) || 50; // distance in KM

    // Approximate conversion: 1 degree latitude ≈ 111km
    const latDelta = distanceKm / 111;
    // Longitude delta depends on latitude
    const lngDelta =
      distanceKm / (111 * Math.cos((latitude * Math.PI) / 180) || 1);

    const query = {
      'address.coordinates.lat': {
        $gte: latitude - latDelta,
        $lte: latitude + latDelta,
      },
      'address.coordinates.lng': {
        $gte: longitude - lngDelta,
        $lte: longitude + lngDelta,
      },
      status: 'active',
    };

    if (gender) {
      query.genderServices = { $in: [gender, 'unisex'] };
    }

    let salons = await Salon.find(query)
      .populate('ownerId', 'name email phone')
      .limit(20);

    // Fallback: if no salons found in radius, return top active salons for the gender
    if (!salons.length) {
      const fallbackQuery = { status: 'active' };
      if (gender) {
        fallbackQuery.genderServices = { $in: [gender, 'unisex'] };
      }

      salons = await Salon.find(fallbackQuery)
        .populate('ownerId', 'name email phone')
        .sort({ 'rating.average': -1 })
        .limit(20);
    }

    res.json(salons);
  } catch (error) {
    console.error('Get Nearby Salons Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSalonById = async (req, res) => {
  try {
    const Barber = (await import('../models/Barber.model.js')).default;
    
    const salon = await Salon.findById(req.params.id)
      .populate('ownerId', 'name email phone');

    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    // Fetch barbers for this salon
    const barbers = await Barber.find({
      salonId: salon._id,
      status: 'approved',
    }).populate('userId', 'name email phone');

    const salonObj = salon.toObject();
    salonObj.barbers = barbers;

    res.json(salonObj);
  } catch (error) {
    console.error('Get Salon Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createSalon = async (req, res) => {
  try {
    const salonData = {
      ...req.body,
      ownerId: req.user._id,
    };

    const salon = await Salon.create(salonData);
    res.status(201).json(salon);
  } catch (error) {
    console.error('Create Salon Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSalon = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    // Check ownership or admin
    if (salon.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(salon, req.body);
    await salon.save();

    res.json(salon);
  } catch (error) {
    console.error('Update Salon Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteSalon = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    await salon.deleteOne();
    res.json({ message: 'Salon deleted successfully' });
  } catch (error) {
    console.error('Delete Salon Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
