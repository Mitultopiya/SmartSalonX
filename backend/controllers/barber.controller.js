import Barber from '../models/Barber.model.js';
import Salon from '../models/Salon.model.js';
import { verifyCertificate } from '../utils/aiVerification.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registerBarber = async (req, res) => {
  try {
    const { salonId, specialization, experience, workingHours } = req.body;

    // Check if barber already exists
    const existingBarber = await Barber.findOne({ userId: req.user._id });
    if (existingBarber) {
      return res.status(400).json({ message: 'Barber profile already exists' });
    }

    // Verify salon exists
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    let certificateData = {};

    if (req.file) {
      const certificatePath = req.file.path;
      const aiVerification = await verifyCertificate(certificatePath);

      certificateData = {
        url: `/uploads/certificates/${req.file.filename}`,
        verified: false,
        aiVerification,
      };
    }

    const barber = await Barber.create({
      userId: req.user._id,
      salonId,
      specialization: specialization ? JSON.parse(specialization) : [],
      experience: experience || 0,
      workingHours: workingHours ? JSON.parse(workingHours) : getDefaultWorkingHours(),
      certificate: certificateData,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Barber registration submitted. Pending admin approval.',
      barber,
    });
  } catch (error) {
    console.error('Register Barber Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBarberProfile = async (req, res) => {
  try {
    const barber = await Barber.findOne({ userId: req.user._id })
      .populate('salonId', 'name address')
      .populate('userId', 'name email phone');

    if (!barber) {
      return res.status(404).json({ message: 'Barber profile not found' });
    }

    res.json(barber);
  } catch (error) {
    console.error('Get Barber Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBarberProfile = async (req, res) => {
  try {
    const barber = await Barber.findOne({ userId: req.user._id });

    if (!barber) {
      return res.status(404).json({ message: 'Barber profile not found' });
    }

    const { specialization, experience } = req.body;

    if (specialization) barber.specialization = JSON.parse(specialization);
    if (experience) barber.experience = experience;

    await barber.save();

    res.json({ message: 'Profile updated successfully', barber });
  } catch (error) {
    console.error('Update Barber Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateWorkingHours = async (req, res) => {
  try {
    const barber = await Barber.findOne({ userId: req.user._id });

    if (!barber) {
      return res.status(404).json({ message: 'Barber profile not found' });
    }

    barber.workingHours = req.body.workingHours || barber.workingHours;
    await barber.save();

    res.json({ message: 'Working hours updated successfully', barber });
  } catch (error) {
    console.error('Update Working Hours Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBarbers = async (req, res) => {
  try {
    const { salonId, status, gender } = req.query;
    const query = {};

    if (salonId) {
      query.salonId = salonId;
    }
    if (status) {
      query.status = status;
    }

    const barbers = await Barber.find(query)
      .populate('userId', 'name')
      .populate('salonId', 'name')
      .sort({ 'rating.average': -1 });

    // Filter by gender if provided
    let filteredBarbers = barbers;
    if (gender) {
      // This would require additional logic based on barber's service capabilities
      // For now, we'll return all barbers
    }

    res.json(filteredBarbers);
  } catch (error) {
    console.error('Get Barbers Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBarberById = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('salonId', 'name address');

    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }

    res.json(barber);
  } catch (error) {
    console.error('Get Barber Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDefaultWorkingHours = () => {
  return {
    monday: { start: '09:00', end: '18:00', isWorking: true },
    tuesday: { start: '09:00', end: '18:00', isWorking: true },
    wednesday: { start: '09:00', end: '18:00', isWorking: true },
    thursday: { start: '09:00', end: '18:00', isWorking: true },
    friday: { start: '09:00', end: '18:00', isWorking: true },
    saturday: { start: '09:00', end: '18:00', isWorking: true },
    sunday: { start: '10:00', end: '16:00', isWorking: false },
  };
};
