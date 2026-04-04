import ChapaService from '../services/chapaService.js';
import Order from '../models/Order.js';

/**
 * Initialize Chapa payment
 * @route POST /api/payments/initiate
 * @access Private
 */
export const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    console.log('📦 Initiating payment for order:', orderId);
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Check Chapa configuration
    if (!process.env.CHAPA_SECRET_KEY) {
      console.error('❌ CHAPA_SECRET_KEY not configured');
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured. Please contact support.'
      });
    }

    // Generate transaction reference
    const tx_ref = ChapaService.generateTransactionReference();
    
    // Prepare URLs
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const callback_url = `${baseUrl}/api/payments/verify?tx_ref=${tx_ref}&order_id=${orderId}`;
    const return_url = `${frontendUrl}/payment-status`;

    console.log('💰 Payment details:', {
      amount: order.totalAmount,
      email: order.shippingAddress.email,
      phone: order.shippingAddress.phone,
      tx_ref: tx_ref,
      callback_url: callback_url
    });

    // Initialize payment with CBE Birr support
    const payment = await ChapaService.initializePayment({
      amount: order.totalAmount,
      email: order.shippingAddress.email,
      phone: order.shippingAddress.phone,
      name: order.shippingAddress.fullName,
      tx_ref: tx_ref,
      callback_url: callback_url,
      return_url: return_url
    });

    if (!payment.success) {
      console.error('❌ Payment initialization failed:', payment.message);
      return res.status(400).json({
        success: false,
        message: payment.message
      });
    }

    // Validate checkout URL
    if (!payment.data.checkout_url) {
      console.error('❌ No checkout URL in response');
      return res.status(500).json({
        success: false,
        message: 'Invalid payment response from gateway'
      });
    }

    // Update order
    order.paymentReference = tx_ref;
    order.paymentStatus = 'processing';
    await order.save();

    console.log('✅ Payment initiated successfully');
    console.log('🔗 Redirect URL:', payment.data.checkout_url);

    res.status(200).json({
      success: true,
      data: {
        checkout_url: payment.data.checkout_url,
        tx_ref: tx_ref
      }
    });
  } catch (error) {
    console.error('❌ Initiate payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Verify payment (Called by redirect from Chapa)
 * @route GET /api/payments/verify
 * @access Public
 */
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref, order_id, status } = req.query;
    
    console.log('🔍 Verifying payment:', { tx_ref, order_id, status });
    
    if (!tx_ref || !order_id) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=failed&message=Invalid payment reference`);
    }

    // Find order
    const order = await Order.findById(order_id);
    if (!order) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=failed&message=Order not found`);
    }

    // Verify payment with Chapa API
    const verification = await ChapaService.verifyPayment(tx_ref);
    
    if (verification.success && verification.data.data?.status === 'success') {
      // Payment successful
      order.paymentStatus = 'completed';
      order.orderStatus = 'confirmed';
      order.paymentDetails = {
        transactionId: verification.data.data.reference || verification.data.data.transaction_id,
        paymentMethod: verification.data.data.payment_method || 'chapa',
        amount: verification.data.data.amount,
        currency: verification.data.data.currency || 'ETB',
        paymentDate: new Date(),
        reference: tx_ref
      };
      await order.save();
      await order.addStatusHistory('confirmed', 'Payment confirmed via Chapa', order.user);
      
      console.log('✅ Payment verified successfully for order:', order_id);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=success&order_id=${order_id}`);
    } else {
      // Payment failed
      order.paymentStatus = 'failed';
      await order.save();
      
      console.log('❌ Payment verification failed');
      return res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=failed&message=Payment verification failed`);
    }
  } catch (error) {
    console.error('❌ Verify payment error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=failed&message=Payment verification error`);
  }
};

/**
 * Webhook (optional)
 */
export const chapaWebhook = async (req, res) => {
  console.log('📨 Webhook received (ignored in redirect-only flow)');
  res.status(200).json({ status: 'success' });
};