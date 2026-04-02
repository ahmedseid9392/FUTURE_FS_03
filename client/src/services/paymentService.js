import api from './api';

export const paymentService = {
  initiatePayment: async (orderId) => {
    try {
      const response = await api.post('/payments/initiate', { orderId });
      return response.data;
    } catch (error) {
      console.error('Initiate payment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Payment initiation failed'
      };
    }
  }
};