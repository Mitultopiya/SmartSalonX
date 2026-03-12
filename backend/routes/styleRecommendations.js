import express from 'express';
import * as styleRecommendationController from '../controllers/styleRecommendationController.mjs';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', styleRecommendationController.getRecommendations);
router.get('/trending', styleRecommendationController.getTrendingStyles);
router.get('/search', styleRecommendationController.searchStyles);
router.get('/face-shape/:faceShape', styleRecommendationController.getStylesByFaceShape);
router.get('/:id', styleRecommendationController.getStyleById);

// Protected routes (authentication required)
router.use(authenticate);
router.post('/preference', styleRecommendationController.saveStylePreference);

export default router;
