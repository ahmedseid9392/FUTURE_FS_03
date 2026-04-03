import api from './api';

export const paymentService = {
  initiatePayment: async (orderId) => {
    try {
      // Get the current token
      const token = localStorage.getItem('token');
      console.log('Current token exists:', !!token);
      console.log('Order ID:', orderId);
      
      if (!token) {
        console.error('No authentication token found');
        return {
          success: false,
          message: 'Please login to continue'
        };
      }
      
      console.log('Initiating payment for order:', orderId);
      const response = await api.post('/payments/initiate', { orderId });
      console.log('Payment initiation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Initiate payment error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 403) {
        return {
          success: false,
          message: 'Session expired. Please login again.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Payment initiation failed'
      };
    }
  },
  
  verifyPayment: async (tx_ref, order_id) => {
    try {
      const response = await api.get(`/payments/verify?tx_ref=${tx_ref}&order_id=${order_id}`);
      return response.data;
    } catch (error) {
      console.error('Verify payment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Payment verification failed'
      };
    }
  }
};