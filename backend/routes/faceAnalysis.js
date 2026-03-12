import express from 'express';
import * as faceAnalysisController from '../controllers/faceAnalysisController.mjs';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Upload and analyze face images
router.post('/analyze', faceAnalysisController.uploadAndAnalyze);

// Get user's face analysis history
router.get('/history', faceAnalysisController.getUserAnalysisHistory);

// Get specific face analysis
router.get('/:id', faceAnalysisController.getAnalysisById);

// Update face analysis
router.put('/:id', faceAnalysisController.updateAnalysis);

// Delete face analysis
router.delete('/:id', faceAnalysisController.deleteAnalysis);

export default router;
