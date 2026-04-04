import RecommendationService from '../services/recommendationService.js';

/**
 * Get personalized recommendations for user
 * @route GET /api/recommendations/personalized
 * @access Private
 */
export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const recommendations = await RecommendationService.getPersonalizedRecommendations(req.user.id);
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Personalized recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
};

/**
 * Get frequently bought together products
 * @route GET /api/recommendations/frequently-bought/:productId
 * @access Public
 */
export const getFrequentlyBoughtTogether = async (req, res) => {
  try {
    const { productId } = req.params;
    const products = await RecommendationService.getFrequentlyBoughtTogether(productId);
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Frequently bought together error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
};

/**
 * Get recommendations based on cart
 * @route POST /api/recommendations/cart-based
 * @access Public
 */
export const getCartBasedRecommendations = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const recommendations = await RecommendationService.getCartBasedRecommendations(cartItems);
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Cart based recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
};

/**
 * Get similar products
 * @route GET /api/recommendations/similar/:productId
 * @access Public
 */
export const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const products = await RecommendationService.getSimilarProducts(productId);
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Similar products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
};

/**
 * Get trending products
 * @route GET /api/recommendations/trending
 * @access Public
 */
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await RecommendationService.getTrendingProducts();
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Trending products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trending products'
    });
  }
};