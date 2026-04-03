import axios from 'axios';
import crypto from 'crypto';

class ChapaService {
  constructor() {
    this.secretKey = process.env.CHAPA_SECRET_KEY;
    this.apiUrl = process.env.CHAPA_API_URL;
    this.encryptionKey = process.env.CHAPA_ENCRYPTION_KEY;
    
    console.log('Chapa Service Initialized');
    console.log('API URL:', this.apiUrl);
    console.log('Secret Key exists:', !!this.secretKey);
  }

  /**
   * Initialize payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} - Payment initialization response
   */
  async initializePayment(paymentData) {
    try {
      const {
        amount,
        email,
        phone,
        name,
        tx_ref,
        callback_url,
        return_url
      } = paymentData;

      // Validate required fields
      if (!amount || !email || !tx_ref || !callback_url || !return_url) {
        return {
          success: false,
          message: 'Missing required payment fields'
        };
      }

      const payload = {
        amount: Math.round(amount),
        currency: 'ETB',
        email: email,
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ')[1] || 'Customer',
        phone_number: phone,
        tx_ref: tx_ref,
        callback_url: callback_url,
        return_url: return_url,
        customization: {
          title: 'Jams Boutique',
          description: `Order Payment - ${tx_ref}`
        }
      };

      console.log('Sending payment request to Chapa:', {
        amount: payload.amount,
        email: payload.email,
        tx_ref: payload.tx_ref
      });

      const response = await axios.post(
        `${this.apiUrl}/transaction/initialize`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Chapa response:', response.data);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Chapa initialization error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Payment initialization failed'
      };
    }
  }

  /**
   * Verify payment
   * @param {string} tx_ref - Transaction reference
   * @returns {Promise<Object>} - Payment verification response
   */
  async verifyPayment(tx_ref) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/transaction/verify/${tx_ref}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Chapa verification error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Payment verification failed'
      };
    }
  }

  /**
   * Generate unique transaction reference
   * @returns {string} - Unique transaction reference
   */
  generateTransactionReference() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `JAMS-${timestamp}-${random}`;
  }
}

export default new ChapaService();