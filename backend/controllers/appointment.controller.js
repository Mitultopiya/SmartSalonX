import Appointment from '../models/Appointment.model.js';
import Barber from '../models/Barber.model.js';
import Hairstyle from '../models/Hairstyle.model.js';
import User from '../models/User.model.js';
import Wallet from '../models/Wallet.model.js';
import Commission from '../models/Commission.model.js';
import { checkSlotAvailability, generateAvailableSlots, calculateRefund } from '../utils/appointmentUtils.js';
import moment from 'moment';

export const getAvailableSlots = async (req, res) => {
  try {
    const { barberId, date, hairstyleId, serviceIds } = req.query;

    if (!barberId || !date) {
      return res.status(400).json({ message: 'barberId and date are required' });
    }

    let totalDuration = 0;

    if (serviceIds) {
      // Multi-service: serviceIds is comma-separated list
      const ids = String(serviceIds)
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
      if (!ids.length) {
        return res.status(400).json({ message: 'serviceIds is empty' });
      }
      const hairstyles = await Hairstyle.find({ _id: { $in: ids } });
      if (!hairstyles.length) {
        return res.status(404).json({ message: 'Services not found' });
      }
      totalDuration = hairstyles.reduce((sum, h) => sum + (h.duration || 0), 0);
    } else if (hairstyleId) {
      const hairstyle = await Hairstyle.findById(hairstyleId);
      if (!hairstyle) {
        return res.status(404).json({ message: 'Hairstyle not found' });
      }
      totalDuration = hairstyle.duration;
    } else {
      return res
        .status(400)
        .json({ message: 'Either hairstyleId or serviceIds must be provided' });
    }

    const slots = await generateAvailableSlots(barberId, date, totalDuration);
    res.json(slots);
  } catch (error) {
    console.error('Get Available Slots Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { salonId, barberId, hairstyleId, serviceIds, startTime, rewardPointsUsed = 0 } = req.body;

    const barber = await Barber.findById(barberId);
    if (!barber || barber.status !== 'approved') {
      return res.status(404).json({ message: 'Barber not found or not approved' });
    }

    // Resolve services (multi or single)
    let services = [];
    let totalDuration = 0;
    let totalPrice = 0;
    let primaryHairstyleId = null;

    if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
      const hairstyles = await Hairstyle.find({ _id: { $in: serviceIds } });
      if (!hairstyles.length) {
        return res.status(404).json({ message: 'Selected services not found' });
      }
      services = hairstyles.map((h) => ({
        hairstyleId: h._id,
        name: h.name,
        duration: h.duration,
        price: h.price,
      }));
      totalDuration = hairstyles.reduce((sum, h) => sum + (h.duration || 0), 0);
      totalPrice = hairstyles.reduce((sum, h) => sum + (h.price || 0), 0);
      primaryHairstyleId = hairstyles[0]._id;
    } else {
      // Backward-compatible single hairstyle flow
      const hairstyle = await Hairstyle.findById(hairstyleId);
      if (!hairstyle) {
        return res.status(404).json({ message: 'Hairstyle not found' });
      }
      services = [
        {
          hairstyleId: hairstyle._id,
          name: hairstyle.name,
          duration: hairstyle.duration,
          price: hairstyle.price,
        },
      ];
      totalDuration = hairstyle.duration;
      totalPrice = hairstyle.price;
      primaryHairstyleId = hairstyle._id;
    }

    // Calculate times based on totalDuration
    const appointmentStart = new Date(startTime);
    const appointmentEnd = moment(appointmentStart).add(totalDuration, 'minutes').toDate();

    // Check slot availability for full combined duration
    const isAvailable = await checkSlotAvailability(barberId, appointmentStart, appointmentEnd);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    // Calculate pricing
    const user = await User.findById(req.user._id);
    let discount = 0;

    if (rewardPointsUsed > 0 && rewardPointsUsed <= user.rewardPoints) {
      discount = Math.min(rewardPointsUsed * 1, totalPrice); // 1 point = ₹1
    }

    const finalAmount = Math.max(0, totalPrice - discount);

    // Create appointment
    const appointment = await Appointment.create({
      userId: req.user._id,
      salonId,
      barberId,
      hairstyleId: primaryHairstyleId, // primary for backward-compatibility
      services,
      appointmentDate: appointmentStart,
      startTime: appointmentStart,
      endTime: appointmentEnd,
      duration: totalDuration,
      price: totalPrice,
      discount,
      rewardPointsUsed,
      finalAmount,
      status: 'PENDING_PAYMENT',
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create Appointment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { status, role } = req.query;
    const query = {};

    if (req.user.role === 'user') {
      query.userId = req.user._id;
    } else if (req.user.role === 'barber') {
      const barber = await Barber.findOne({ userId: req.user._id });
      if (barber) {
        query.barberId = barber._id;
      } else {
        return res.json([]);
      }
    }

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('salonId', 'name address')
      .populate({
        path: 'barberId',
        populate: {
          path: 'userId',
          select: 'name',
        },
      })
      .populate('services.hairstyleId', 'name price duration')
      .populate('hairstyleId', 'name price duration')
      .sort({ startTime: -1 });

    res.json(appointments);
  } catch (error) {
    console.error('Get Appointments Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('salonId', 'name address phone')
      .populate('barberId')
      .populate('hairstyleId')
      .populate('services.hairstyleId', 'name price duration');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      appointment.userId._id.toString() !== req.user._id.toString()
    ) {
      const barber = await Barber.findOne({ userId: req.user._id });
      if (!barber || barber._id.toString() !== appointment.barberId._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get Appointment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Appointment cannot be cancelled' });
    }

    // Calculate refund (only if already paid)
    const refundAmount = appointment.payment?.status === 'SUCCESS' ? calculateRefund(appointment) : 0;

    appointment.status = 'CANCELLED';
    appointment.cancellation = {
      cancelledBy: req.user.role,
      cancelledAt: new Date(),
      reason: req.body.reason || 'User cancellation',
      refundAmount,
      refundStatus: refundAmount > 0 ? 'pending' : 'processed',
    };

    if (refundAmount > 0 && appointment.payment.status === 'SUCCESS') {
      appointment.payment.status = 'REFUNDED';
      // Refund logic would be handled by payment controller
    }

    await appointment.save();

    // Refund reward points if used
    if (appointment.rewardPointsUsed > 0) {
      const user = await User.findById(appointment.userId);
      user.rewardPoints += appointment.rewardPointsUsed;
      await user.save();
    }

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    console.error('Cancel Appointment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status !== 'CONFIRMED') {
      return res.status(400).json({ message: 'Appointment cannot be completed' });
    }

    appointment.status = 'COMPLETED';
    await appointment.save();

    // NOTE:
    // Wallet/commission is now handled at payment SUCCESS (Payment Simulation module),
    // so we don't double-credit here. Completion only awards reward points + enables review.

    // Award reward points to user
    const user = await User.findById(appointment.userId);
    user.rewardPoints += 20;
    await user.save();

    res.json({ message: 'Appointment completed', appointment });
  } catch (error) {
    console.error('Complete Appointment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (appointment.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Can only review completed appointments' });
    }

    appointment.review = {
      rating,
      comment,
      createdAt: new Date(),
    };
    await appointment.save();

    // Update barber rating
    const barber = await Barber.findById(appointment.barberId);
    const totalRating = barber.rating.average * barber.rating.count + rating;
    barber.rating.count += 1;
    barber.rating.average = totalRating / barber.rating.count;
    await barber.save();

    res.json({ message: 'Review added successfully', appointment });
  } catch (error) {
    console.error('Add Review Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
