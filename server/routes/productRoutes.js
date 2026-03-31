import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  addReview,
  getCategories
} from '../controllers/productController.js';
import {
  validateProduct,
  validateReview
} from '../utils/productValidation.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories/all', getCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Protected routes (reviews)
router.post('/:id/reviews', protect, validateReview, addReview);

// Admin routes
router.post('/', protect, admin, validateProduct, createProduct);
router.put('/:id', protect, admin, validateProduct, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;