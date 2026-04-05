import express from 'express';
import {
  validateCoupon,
  applyCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponStats
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/Protected routes
router.post('/validate', protect, validateCoupon);
router.post('/apply', protect, applyCoupon);

// Admin routes
router.get('/', protect, admin, getAllCoupons);
router.get('/stats', protect, admin, getCouponStats);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;