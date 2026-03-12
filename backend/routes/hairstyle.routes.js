import express from 'express';
import {
  getHairstyles,
  getHairstyleById,
} from '../controllers/hairstyle.controller.js';

const router = express.Router();

router.get('/', getHairstyles);
router.get('/:id', getHairstyleById);

export default router;
