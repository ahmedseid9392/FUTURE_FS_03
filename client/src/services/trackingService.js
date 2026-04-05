import api from './api';

export const trackingService = {
  // Get tracking info for logged-in user
  getTrackingInfo: async (orderId) => {
    try {
      const response = await api.get(`/tracking/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get tracking error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get tracking info'
      };
    }
  },
  
  // Track order without login (by order number and email)
  trackOrder: async (orderNumber, email) => {
    try {
      const response = await api.post('/tracking/track', { orderNumber, email });
      return response.data;
    } catch (error) {
      console.error('Track order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to track order'
      };
    }
  }
};