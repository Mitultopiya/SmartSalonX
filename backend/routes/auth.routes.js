import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').custom((value) => {
    if (!value.endsWith('@gmail.com')) {
      throw new Error('Email must be a Gmail address (@gmail.com)');
    }
    return true;
  }),
  body('password').isLength({ min: 4, max: 12 }).withMessage('Password must be between 4-12 characters').custom((value) => {
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(value)) {
      throw new Error('Password must contain at least one lowercase letter');
    }
    // Check for at least one digit
    if (!/\d/.test(value)) {
      throw new Error('Password must contain at least one digit');
    }
    // Check for exactly one special character
    const specialCharCount = (value.match(/[^a-zA-Z0-9]/g) || []).length;
    if (specialCharCount !== 1) {
      throw new Error('Password must contain exactly one special character');
    }
    return true;
  }),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('role').optional().isIn(['user', 'barber', 'admin']).withMessage('Role must be user, barber, or admin'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;