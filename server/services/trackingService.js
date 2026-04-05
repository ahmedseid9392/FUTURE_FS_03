import Order from '../models/Order.js';

class TrackingService {
  // Generate tracking number
  generateTrackingNumber(orderId) {
    const prefix = 'JAMS';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  // Update order status with tracking
  async updateOrderStatus(orderId, status, note, location = null) {
    const order = await Order.findById(orderId);
    if (!order) return null;

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      note,
      location,
      date: new Date()
    });

    // Set specific dates based on status
    if (status === 'shipped') {
      // Set estimated delivery (5-7 days from now)
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + 7);
      order.estimatedDelivery = estimatedDate;
    }
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }
    
    if (status === 'cancelled') {
      order.cancelledAt = new Date();
    }

    await order.save();
    return order;
  }

  // Get tracking timeline
  async getTrackingTimeline(orderId) {
    const order = await Order.findById(orderId);
    if (!order) return null;

    const timeline = [];
    
    // Order placed
    timeline.push({
      status: 'Order Placed',
      description: 'Your order has been confirmed',
      date: order.createdAt,
      completed: true,
      icon: 'order'
    });

    // Processing
    const processingIndex = order.statusHistory.findIndex(h => h.status === 'processing');
    timeline.push({
      status: 'Processing',
      description: 'Your order is being prepared',
      date: processingIndex >= 0 ? order.statusHistory[processingIndex].date : null,
      completed: order.orderStatus !== 'pending',
      icon: 'processing'
    });

    // Confirmed
    const confirmedIndex = order.statusHistory.findIndex(h => h.status === 'confirmed');
    timeline.push({
      status: 'Confirmed',
      description: 'Your order has been confirmed',
      date: confirmedIndex >= 0 ? order.statusHistory[confirmedIndex].date : null,
      completed: order.orderStatus !== 'pending' && order.orderStatus !== 'processing',
      icon: 'confirmed'
    });

    // Shipped
    const shippedIndex = order.statusHistory.findIndex(h => h.status === 'shipped');
    timeline.push({
      status: 'Shipped',
      description: 'Your order is on the way',
      date: shippedIndex >= 0 ? order.statusHistory[shippedIndex].date : null,
      completed: order.orderStatus === 'shipped' || order.orderStatus === 'out_for_delivery' || order.orderStatus === 'delivered',
      icon: 'shipped',
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery
    });

    // Out for Delivery
    const outForDeliveryIndex = order.statusHistory.findIndex(h => h.status === 'out_for_delivery');
    timeline.push({
      status: 'Out for Delivery',
      description: 'Your order is out for delivery',
      date: outForDeliveryIndex >= 0 ? order.statusHistory[outForDeliveryIndex].date : null,
      completed: order.orderStatus === 'out_for_delivery' || order.orderStatus === 'delivered',
      icon: 'delivery'
    });

    // Delivered
    timeline.push({
      status: 'Delivered',
      description: 'Your order has been delivered',
      date: order.deliveredAt,
      completed: order.orderStatus === 'delivered',
      icon: 'delivered'
    });

    return timeline;
  }

  // Get estimated delivery date
  getEstimatedDelivery(order) {
    if (order.estimatedDelivery) {
      return order.estimatedDelivery;
    }
    
    // Calculate based on order date
    const orderDate = new Date(order.createdAt);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + 7);
    return estimatedDate;
  }
}

export default new TrackingService();