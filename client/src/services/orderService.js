import api from './api';

export const orderService = {
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get(`/orders?${params.toString()}`);
      
      // Handle different response structures
      if (response.data.success) {
        return {
          success: true,
          data: {
            orders: response.data.orders || [],
            pagination: response.data.pagination || { page: 1, pages: 1, total: 0 }
          }
        };
      }
      
      return {
        success: false,
        data: { orders: [], pagination: { page: 1, pages: 1, total: 0 } },
        message: response.data.message || 'Failed to fetch orders'
      };
    } catch (error) {
      console.error('Get orders error:', error);
      return {
        success: false,
        data: { orders: [], pagination: { page: 1, pages: 1, total: 0 } },
        message: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order'
      };
    }
  },
  
  updateStatus: async (id, data) => {
    try {
      const response = await api.put(`/orders/${id}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update order status'
      };
    }
  },
  
  updatePayment: async (id, data) => {
    try {
      const response = await api.put(`/orders/${id}/payment`, data);
      return response.data;
    } catch (error) {
      console.error('Update payment status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update payment status'
      };
    }
  },
  
  cancel: async (id, reason) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Cancel order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel order'
      };
    }
  }
};