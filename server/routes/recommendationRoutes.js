import express from 'express';
import {
  getPersonalizedRecommendations,
  getFrequentlyBoughtTogether,
  getCartBasedRecommendations,
  getSimilarProducts,
  getTrendingProducts
} from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/frequently-bought/:productId', getFrequentlyBoughtTogether);
router.post('/cart-based', getCartBasedRecommendations);
router.get('/similar/:productId', getSimilarProducts);
router.get('/trending', getTrendingProducts);

// Protected routes (require login)
router.get('/personalized', protect, getPersonalizedRecommendations);

export default router;