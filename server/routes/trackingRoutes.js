import express from 'express';
import {
  getTrackingInfo,
  trackOrderByNumber,
  updateTracking
} from '../controllers/trackingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - track by order number (no login required)
router.post('/track', trackOrderByNumber);

// Protected routes
router.get('/:orderId', protect, getTrackingInfo);

// Admin routes
router.put('/:orderId/update', protect, admin, updateTracking);

export default router;