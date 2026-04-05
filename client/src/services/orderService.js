import api from './api';

export const orderService = {
  create: async (orderData) => {
    try {
      console.log('📤 Creating order with data:', orderData);
      const response = await api.post('/orders', orderData);
      console.log('✅ Raw API response:', response.data);
      
      if (response.data.success) {
        return {
          success: true,
          data: {
            order: response.data.order || response.data.data?.order,
            orderNumber: response.data.order?.orderNumber || response.data.data?.orderNumber,
            _id: response.data.order?._id || response.data.data?._id
          },
          message: response.data.message
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to create order',
        errors: response.data.errors
      };
    } catch (error) {
      console.error('❌ Create order error:', error);
      console.error('Error response:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create order',
        errors: error.response?.data?.errors
      };
    }
  },
  
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.sort) params.append('sort', filters.sort);
      
      const response = await api.get(`/orders?${params.toString()}`);
      
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
      console.log('Get order by ID response:', response.data);
      
      if (response.data.success) {
        return {
          success: true,
          order: response.data.order || response.data.data?.order
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to fetch order'
      };
    } catch (error) {
      console.error('Get order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order'
      };
    }
  },
  
  getMyOrders: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
      console.log('My orders response:', response.data);
      
      if (response.data.success) {
        return {
          success: true,
          data: {
            orders: response.data.orders || response.data.data?.orders || [],
            pagination: response.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 }
          }
        };
      }
      
      return {
        success: false,
        data: { orders: [], pagination: {} },
        message: response.data.message || 'Failed to fetch orders'
      };
    } catch (error) {
      console.error('Get my orders error:', error);
      return {
        success: false,
        data: { orders: [], pagination: {} },
        message: error.response?.data?.message || 'Failed to fetch orders'
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
  },
  
  // Add this method - Delete order (only for cancelled orders)
  deleteOrder: async (orderId) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Delete order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete order'
      };
    }
  }
};

export default orderService;