import express from 'express';
import { initiatePayment, simulatePayment } from '../controllers/paymentSim.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Payment Simulation (no third-party gateways)
router.post('/initiate', authenticate, initiatePayment);
router.post('/simulate', authenticate, simulatePayment);

export default router;
