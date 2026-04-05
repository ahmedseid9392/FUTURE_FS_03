import Order from '../models/Order.js';
import TrackingService from '../services/trackingService.js';

// Get order tracking info
export const getTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization (user or admin)
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const timeline = await TrackingService.getTrackingTimeline(orderId);
    const estimatedDelivery = TrackingService.getEstimatedDelivery(order);

    res.status(200).json({
      success: true,
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt
        },
        timeline,
        estimatedDelivery,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        currentStatus: order.orderStatus,
        statusHistory: order.statusHistory
      }
    });
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Track order without login (by order number and email)
export const trackOrderByNumber = async (req, res) => {
  try {
    const { orderNumber, email } = req.body;
    
    if (!orderNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Order number and email are required'
      });
    }

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify email matches
    if (order.shippingAddress.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Invalid email for this order'
      });
    }

    const timeline = await TrackingService.getTrackingTimeline(order._id);
    const estimatedDelivery = TrackingService.getEstimatedDelivery(order);

    res.status(200).json({
      success: true,
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt
        },
        timeline,
        estimatedDelivery,
        trackingNumber: order.trackingNumber,
        currentStatus: order.orderStatus
      }
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin: Update tracking info
export const updateTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, trackingUrl, status, note, location } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    
    if (status) {
      await TrackingService.updateOrderStatus(orderId, status, note || '', location);
    }
    
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Tracking info updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};