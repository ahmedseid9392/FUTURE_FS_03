import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats
} from '../controllers/orderController.js';
import {
  validateOrder,
  validateOrderStatus,
  validatePaymentStatus
} from '../utils/orderValidation.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected user routes
router.post('/', protect, validateOrder, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.get('/stats/overview', protect, admin, getOrderStats);
router.put('/:id/status', protect, admin, validateOrderStatus, updateOrderStatus);
router.put('/:id/payment', protect, admin, validatePaymentStatus, updatePaymentStatus);

export default router;