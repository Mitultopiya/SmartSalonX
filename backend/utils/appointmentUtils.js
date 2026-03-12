import Appointment from '../models/Appointment.model.js';
import moment from 'moment';

/**
 * Check if a time slot is available for a barber
 */
export const checkSlotAvailability = async (barberId, startTime, endTime, excludeAppointmentId = null) => {
  const query = {
    barberId,
    // Block slot for both unpaid locks and confirmed bookings
    status: { $in: ['PENDING_PAYMENT', 'CONFIRMED'] },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      },
    ],
  };

  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }

  const conflictingAppointment = await Appointment.findOne(query);

  return !conflictingAppointment;
};

/**
 * Generate available time slots for a barber on a given date
 */
export const generateAvailableSlots = async (barberId, date, hairstyleDuration) => {
  const Barber = (await import('../models/Barber.model.js')).default;
  const barber = await Barber.findById(barberId).populate('salonId');

  if (!barber) {
    return [];
  }

  const selectedDate = moment(date).format('dddd').toLowerCase();
  const workingHours = barber.workingHours[selectedDate];

  if (!workingHours || !workingHours.isWorking) {
    return [];
  }

  const slots = [];
  const start = moment(date).set({
    hour: parseInt(workingHours.start.split(':')[0]),
    minute: parseInt(workingHours.start.split(':')[1]),
  });
  const end = moment(date).set({
    hour: parseInt(workingHours.end.split(':')[0]),
    minute: parseInt(workingHours.end.split(':')[1]),
  });

  let currentSlot = moment(start);

  while (currentSlot.isBefore(end)) {
    const slotStart = moment(currentSlot);
    const slotEnd = moment(currentSlot).add(hairstyleDuration, 'minutes');

    if (slotEnd.isAfter(end)) {
      break;
    }

    // Check if slot is available
    const isAvailable = await checkSlotAvailability(
      barberId,
      slotStart.toDate(),
      slotEnd.toDate()
    );

    if (isAvailable) {
      slots.push({
        start: slotStart.toDate(),
        end: slotEnd.toDate(),
        displayTime: slotStart.format('HH:mm'),
      });
    }

    currentSlot.add(15, 'minutes'); // 15-minute intervals
  }

  return slots;
};

/**
 * Calculate refund amount based on cancellation time
 */
export const calculateRefund = (appointment) => {
  const now = moment();
  const appointmentTime = moment(appointment.startTime);
  const minutesUntilAppointment = appointmentTime.diff(now, 'minutes');

  let refundPercentage = 0;

  if (minutesUntilAppointment > 30) {
    refundPercentage = 0.8; // 80% refund
  } else if (minutesUntilAppointment > 0) {
    refundPercentage = 0.5; // 50% refund
  }
  // No refund for no-show or cancellation after appointment time

  return Math.round(appointment.finalAmount * refundPercentage);
};
