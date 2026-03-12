import express from 'express';
import {
  getSalons,
  getSalonById,
  getNearbySalons,
  createSalon,
  updateSalon,
  deleteSalon,
} from '../controllers/salon.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getSalons);
router.get('/nearby', getNearbySalons);
router.get('/:id', getSalonById);
router.post('/', authenticate, authorize('admin', 'barber'), createSalon);
router.put('/:id', authenticate, authorize('admin', 'barber'), updateSalon);
router.delete('/:id', authenticate, authorize('admin'), deleteSalon);

export default router;
