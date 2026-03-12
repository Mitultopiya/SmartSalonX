import express from 'express';
import {
  approveBarber,
  rejectBarber,
  getPendingBarbers,
  getAllUsers,
  getAllBarbers,
  getAllSalons,
  getDashboardStats,
  releaseCommissions,
  getAllHairstyles,
  createHairstyle,
  updateHairstyle,
  deleteHairstyle,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/barbers/pending', getPendingBarbers);
router.put('/barbers/:id/approve', approveBarber);
router.put('/barbers/:id/reject', rejectBarber);
router.get('/users', getAllUsers);
router.get('/barbers', getAllBarbers);
router.get('/salons', getAllSalons);
router.post('/commissions/release', releaseCommissions);
router.get('/hairstyles', getAllHairstyles);
router.post('/hairstyles', createHairstyle);
router.put('/hairstyles/:id', updateHairstyle);
router.delete('/hairstyles/:id', deleteHairstyle);

export default router;