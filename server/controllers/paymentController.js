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
    
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Generate unique transaction reference
    const tx_ref = ChapaService.generateTransactionReference();
    
    // Prepare callback URLs
    const callback_url = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/verify?tx_ref=${tx_ref}&order_id=${orderId}`;
    const return_url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-status`;

    // Initialize payment
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
      return res.status(400).json({
        success: false,
        message: payment.message
      });
    }

    // Update order with payment reference
    order.paymentReference = tx_ref;
    order.paymentStatus = 'processing';
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        checkout_url: payment.data.data.checkout_url,
        tx_ref: tx_ref
      }
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Verify payment
 * @route GET /api/payments/verify
 * @access Public
 */
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref, order_id } = req.query;
    
    if (!tx_ref || !order_id) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=failed&message=Invalid payment reference`);
    }

    // Verify payment with Chapa
    const verification = await ChapaService.verifyPayment(tx_ref);
    
    // Find and update order
    const order = await Order.findById(order_id);
    if (!order) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=failed&message=Order not found`);
    }

    if (verification.success && verification.data.data.status === 'success') {
      // Payment successful
      order.paymentStatus = 'completed';
      order.orderStatus = 'confirmed';
      order.paymentDetails = {
        transactionId: verification.data.data.reference,
        paymentMethod: verification.data.data.payment_method,
        amount: verification.data.data.amount,
        currency: verification.data.data.currency,
        paymentDate: new Date(),
        reference: tx_ref
      };
      await order.save();

      // Add status history
      await order.addStatusHistory('confirmed', 'Payment confirmed via Chapa', order.user);
      
      return res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=success&order_id=${order_id}`);
    } else {
      // Payment failed
      order.paymentStatus = 'failed';
      order.orderStatus = 'pending';
      await order.save();
      
      return res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=failed&message=Payment verification failed`);
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=failed&message=Payment verification error`);
  }
};

/**
 * Chapa Webhook
 * @route POST /api/payments/chapa-webhook
 * @access Public (Verified by signature)
 */
export const chapaWebhook = async (req, res) => {
  try {
    const { data } = req.body;
    
    // Verify webhook signature (optional but recommended)
    const signature = req.headers['x-chapa-signature'];
    
    if (!data || !data.tx_ref) {
      return res.status(400).json({ status: 'error', message: 'Invalid webhook data' });
    }

    // Find order by payment reference
    const order = await Order.findOne({ paymentReference: data.tx_ref });
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    // Update order based on webhook data
    if (data.status === 'success') {
      order.paymentStatus = 'completed';
      order.orderStatus = 'confirmed';
      order.paymentDetails = {
        transactionId: data.reference,
        paymentMethod: data.payment_method,
        amount: data.amount,
        currency: data.currency,
        paymentDate: new Date(),
        reference: data.tx_ref
      };
      await order.save();
      await order.addStatusHistory('confirmed', 'Payment confirmed via Chapa webhook', order.user);
    } else if (data.status === 'failed') {
      order.paymentStatus = 'failed';
      await order.save();
    }

    res.status(200).json({ status: 'success', message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};