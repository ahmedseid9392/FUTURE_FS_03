import express from 'express';
import {
  initiatePayment,
  verifyPayment,
  chapaWebhook
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/initiate', protect, initiatePayment);

// Public routes
router.get('/verify', verifyPayment);
router.post('/chapa-webhook', chapaWebhook);

export default router;