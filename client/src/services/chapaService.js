import axios from 'axios';

class ChapaService {
  constructor() {
    this.secretKey = process.env.CHAPA_SECRET_KEY;
    this.apiUrl = process.env.CHAPA_API_URL || 'https://api.chapa.co/v1';
    
    console.log('🔧 Chapa Service Initialized');
    console.log('📡 API URL:', this.apiUrl);
    console.log('🔑 Secret Key exists:', !!this.secretKey);
  }

  /**
   * Initialize payment for CBE Birr (Minimum 1000 ETB)
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

      // Validate amount - Minimum 1000 ETB for CBE Birr
      if (!amount || amount < 1000) {
        return {
          success: false,
          message: `Minimum order amount for CBE Birr is 1000 ETB. Your total is ${amount || 0} ETB. Please add more items.`
        };
      }

      // Format phone number for Ethiopia
      let formattedPhone = phone;
      if (phone) {
        formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '251' + formattedPhone.substring(1);
        }
        if (!formattedPhone.startsWith('251')) {
          formattedPhone = '251' + formattedPhone;
        }
      }

      const payload = {
        amount: Math.round(amount),
        currency: 'ETB',
        email: email,
        first_name: name?.split(' ')[0] || 'Customer',
        last_name: name?.split(' ')[1] || 'User',
        phone_number: formattedPhone || '251911234567',
        tx_ref: tx_ref,
        callback_url: callback_url,
        return_url: return_url,
        customization: {
          title: 'Jams Boutique',
          description: `Order Payment - ${tx_ref}`
        },
        // Enable CBE Birr specifically
        payment_options: 'cbe'
      };

      console.log('📤 Sending payment request to Chapa:', {
        amount: payload.amount,
        currency: payload.currency,
        email: payload.email,
        phone: payload.phone_number,
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

      console.log('✅ Chapa response status:', response.data.status);
      console.log('✅ Chapa response data:', JSON.stringify(response.data, null, 2));

      if (response.data.status === 'success') {
        const checkoutUrl = response.data.data?.checkout_url || response.data.checkout_url;
        
        if (checkoutUrl) {
          console.log('✅ Checkout URL:', checkoutUrl);
          return {
            success: true,
            data: {
              checkout_url: checkoutUrl,
              tx_ref: tx_ref
            }
          };
        }
      }
      
      return {
        success: false,
        message: response.data.message || 'Payment initialization failed'
      };
    } catch (error) {
      console.error('❌ Chapa initialization error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      let errorMessage = 'Payment initialization failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(tx_ref) {
    try {
      console.log('🔍 Verifying payment for tx_ref:', tx_ref);
      
      const response = await axios.get(
        `${this.apiUrl}/transaction/verify/${tx_ref}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`
          }
        }
      );

      console.log('✅ Verification response:', response.data);

      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Payment verification failed'
        };
      }
    } catch (error) {
      console.error('❌ Chapa verification error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Payment verification failed'
      };
    }
  }

  /**
   * Generate unique transaction reference
   */
  generateTransactionReference() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `JAMS-${timestamp}-${random}`;
  }
}

export default new ChapaService();