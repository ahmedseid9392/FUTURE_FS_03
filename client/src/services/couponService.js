import api from './api';

export const couponService = {
  // Validate coupon
  validateCoupon: async (code, cartTotal) => {
    try {
      const response = await api.post('/coupons/validate', { code, cartTotal });
      return response.data;
    } catch (error) {
      console.error('Validate coupon error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid coupon code'
      };
    }
  },
  
  // Apply coupon to order
  applyCoupon: async (code, orderId, cartTotal) => {
    try {
      const response = await api.post('/coupons/apply', { code, orderId, cartTotal });
      return response.data;
    } catch (error) {
      console.error('Apply coupon error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to apply coupon'
      };
    }
  },
  
  // Admin: Get all coupons
  getAllCoupons: async () => {
    try {
      const response = await api.get('/coupons');
      return response.data;
    } catch (error) {
      console.error('Get coupons error:', error);
      return { success: false, data: [] };
    }
  },
  
  // Admin: Create coupon
  createCoupon: async (couponData) => {
    try {
      const response = await api.post('/coupons', couponData);
      return response.data;
    } catch (error) {
      console.error('Create coupon error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create coupon'
      };
    }
  },
  
  // Admin: Update coupon
  updateCoupon: async (id, couponData) => {
    try {
      const response = await api.put(`/coupons/${id}`, couponData);
      return response.data;
    } catch (error) {
      console.error('Update coupon error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update coupon'
      };
    }
  },
  
  // Admin: Delete coupon
  deleteCoupon: async (id) => {
    try {
      const response = await api.delete(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete coupon error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete coupon'
      };
    }
  },
  
  // Admin: Get coupon stats
  getCouponStats: async () => {
    try {
      const response = await api.get('/coupons/stats');
      return response.data;
    } catch (error) {
      console.error('Get coupon stats error:', error);
      return { success: false, data: {} };
    }
  }
};