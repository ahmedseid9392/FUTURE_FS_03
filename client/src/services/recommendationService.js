import api from './api';

export const recommendationService = {
  // Get personalized recommendations (requires login)
  getPersonalizedRecommendations: async () => {
    try {
      const response = await api.get('/recommendations/personalized');
      return response.data;
    } catch (error) {
      console.error('Personalized recommendations error:', error);
      return { success: false, data: [] };
    }
  },
  
  // Get frequently bought together products
  getFrequentlyBoughtTogether: async (productId) => {
    try {
      const response = await api.get(`/recommendations/frequently-bought/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Frequently bought together error:', error);
      return { success: false, data: [] };
    }
  },
  
  // Get cart-based recommendations
  getCartBasedRecommendations: async (cartItems) => {
    try {
      const response = await api.post('/recommendations/cart-based', { cartItems });
      return response.data;
    } catch (error) {
      console.error('Cart based recommendations error:', error);
      return { success: false, data: [] };
    }
  },
  
  // Get similar products
  getSimilarProducts: async (productId) => {
    try {
      const response = await api.get(`/recommendations/similar/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Similar products error:', error);
      return { success: false, data: [] };
    }
  },
  
  // Get trending products
  getTrendingProducts: async () => {
    try {
      const response = await api.get('/recommendations/trending');
      return response.data;
    } catch (error) {
      console.error('Trending products error:', error);
      return { success: false, data: [] };
    }
  }
};