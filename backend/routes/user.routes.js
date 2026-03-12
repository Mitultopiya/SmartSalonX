import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  addAddress,
  getAddresses,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.get('/addresses', authenticate, getAddresses);
router.post('/addresses', authenticate, addAddress);

export default router;
