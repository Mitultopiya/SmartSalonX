import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
  completeAppointment,
  getAvailableSlots,
  addReview,
} from '../controllers/appointment.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/slots', authenticate, getAvailableSlots);
router.get('/', authenticate, getAppointments);
router.get('/:id', authenticate, getAppointmentById);
router.post('/', authenticate, createAppointment);
router.put('/:id/cancel', authenticate, cancelAppointment);
router.put('/:id/complete', authenticate, authorize('barber', 'admin'), completeAppointment);
router.post('/:id/review', authenticate, addReview);

export default router;
