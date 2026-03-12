import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  registerBarber,
  getBarberProfile,
  updateBarberProfile,
  getBarbers,
  getBarberById,
  updateWorkingHours,
} from '../controllers/barber.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/certificates'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/register', authenticate, upload.single('certificate'), registerBarber);
router.get('/profile', authenticate, authorize('barber'), getBarberProfile);
router.put('/profile', authenticate, authorize('barber'), updateBarberProfile);
router.put('/working-hours', authenticate, authorize('barber'), updateWorkingHours);
router.get('/', getBarbers);
router.get('/:id', getBarberById);

export default router;
