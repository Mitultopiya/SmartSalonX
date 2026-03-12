import express from 'express';
import {
  getWallet,
  withdrawFunds,
  getTransactions,
} from '../controllers/wallet.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorize('barber'), getWallet);
router.get('/transactions', authenticate, authorize('barber'), getTransactions);
router.post('/withdraw', authenticate, authorize('barber'), withdrawFunds);

export default router;
