import mongoose from 'mongoose';

/**
 * Order Item Schema (Embedded)
 */
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  }
});

/**
 * Order Schema Definition with Tracking Support
 */
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    sparse: true,
    index: { unique: true, sparse: true }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'Ethiopia'
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'bank_transfer', 'chapa'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentReference: {
    type: String,
    sparse: true
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    cardLast4: String,
    cardBrand: String
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  // Enhanced status history with location support
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned']
    },
    note: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Tracking fields
  trackingNumber: {
    type: String,
    trim: true,
    default: null
  },
  trackingUrl: {
    type: String,
    trim: true,
    default: null
  },
  estimatedDelivery: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  cancellationReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});


// Virtual: Check if order is deliverable
orderSchema.virtual('isDeliverable').get(function() {
  return this.orderStatus !== 'cancelled' && 
         this.orderStatus !== 'delivered' && 
         this.orderStatus !== 'returned';
});

// Virtual: Get order status in readable format
orderSchema.virtual('statusText').get(function() {
  const statusMap = {
    pending: 'Order Placed',
    processing: 'Processing',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned'
  };
  return statusMap[this.orderStatus] || this.orderStatus;
});

// Virtual: Get tracking progress percentage
orderSchema.virtual('trackingProgress').get(function() {
  const statusOrder = ['pending', 'processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(this.orderStatus);
  if (currentIndex === -1) return 0;
  if (this.orderStatus === 'delivered') return 100;
  return Math.floor((currentIndex / (statusOrder.length - 1)) * 100);
});

// Virtual: Get days since order placed
orderSchema.virtual('daysSinceOrder').get(function() {
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method: Add status history entry with location
orderSchema.methods.addStatusHistory = async function(status, note = '', updatedBy = null, location = '') {
  this.statusHistory.push({
    status,
    note,
    location,
    updatedBy,
    date: new Date()
  });
  
  this.orderStatus = status;
  
  if (status === 'shipped') {
    // Set estimated delivery (5-7 days from now)
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 7);
    this.estimatedDelivery = estimatedDate;
  }
  
  if (status === 'delivered') {
    this.deliveredAt = new Date();
  }
  
  if (status === 'cancelled') {
    this.cancelledAt = new Date();
  }
  
  return this.save();
};

// Method: Update tracking information
orderSchema.methods.updateTracking = async function(trackingNumber, trackingUrl = null) {
  this.trackingNumber = trackingNumber;
  if (trackingUrl) this.trackingUrl = trackingUrl;
  return this.save();
};

// Method: Calculate order totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.totalAmount = this.subtotal + this.shippingCost + this.tax - this.discount;
  return this.totalAmount;
};

// Method: Get estimated delivery range
orderSchema.methods.getEstimatedDeliveryRange = function() {
  if (this.estimatedDelivery) {
    const startDate = new Date(this.estimatedDelivery);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 2);
    return {
      start: startDate,
      end: endDate
    };
  }
  return null;
};

// Method: Check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'processing'].includes(this.orderStatus);
};

// Method: Check if order can be returned
orderSchema.methods.canBeReturned = function() {
  if (this.orderStatus !== 'delivered') return false;
  const daysSinceDelivery = Math.abs(new Date() - this.deliveredAt) / (1000 * 60 * 60 * 24);
  return daysSinceDelivery <= 30; // 30-day return policy
};

// Static: Get orders by user with pagination
orderSchema.statics.getUserOrders = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static: Get orders by status
orderSchema.statics.getOrdersByStatus = function(status, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ orderStatus: status })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static: Get orders by date range
orderSchema.statics.getOrdersByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).sort({ createdAt: -1 });
};

// Static: Get order statistics for admin
orderSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        averageOrderValue: { $avg: '$totalAmount' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
        },
        processingOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'processing'] }, 1, 0] }
        },
        confirmedOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, 1, 0] }
        },
        shippedOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'shipped'] }, 1, 0] }
        },
        outForDeliveryOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'out_for_delivery'] }, 1, 0] }
        },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    outForDeliveryOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  };
};

// Static: Get tracking statistics
orderSchema.statics.getTrackingStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        withTrackingNumber: {
          $sum: { $cond: [{ $ne: ['$trackingNumber', null] }, 1, 0] }
        },
        delivered: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
        },
        inTransit: {
          $sum: { $cond: [{ $in: ['$orderStatus', ['shipped', 'out_for_delivery']] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    withTrackingNumber: 0,
    delivered: 0,
    inTransit: 0
  };
};

// Indexes for performance
orderSchema.index({ orderNumber: 1 }, { unique: true, sparse: true });
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1, orderStatus: 1 });
orderSchema.index({ createdAt: -1, orderStatus: 1 });
orderSchema.index({ trackingNumber: 1 });
orderSchema.index({ estimatedDelivery: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;