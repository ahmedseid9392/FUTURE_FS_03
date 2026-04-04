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
  getCategories,
  getSearchSuggestions,
  getPopularProducts
} from '../controllers/productController.js';
import {
  validateProduct,
  validateReview
} from '../utils/productValidation.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ============ IMPORTANT: Specific routes MUST come before parameterized routes ============

// Public routes (specific paths first)
router.get('/search/suggestions', getSearchSuggestions);
router.get('/featured', getFeaturedProducts);
router.get('/categories/all', getCategories);
router.get('/popular', getPopularProducts);  // Add this route BEFORE /:id
router.get('/category/:category', getProductsByCategory);

// Main products route
router.get('/', getAllProducts);

// Product by ID route (MUST be LAST - catches any /:id parameter)
router.get('/:id', getProductById);

// Protected routes (reviews)
router.post('/:id/reviews', protect, validateReview, addReview);

// Admin routes
router.post('/', protect, admin, validateProduct, createProduct);
router.put('/:id', protect, admin, validateProduct, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;