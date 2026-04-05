import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maximumDiscount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: 1
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: String,
    enum: ['dresses', 'jewelry', 'accessories', 'gifts', 'new-arrivals', 'sale']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  }]
}, {
  timestamps: true
});

// Index for faster lookups
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
couponSchema.index({ endDate: 1 });

// Virtual: Check if coupon is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  const isDateValid = now >= this.startDate && now <= this.endDate;
  const isUsageValid = !this.usageLimit || this.usedCount < this.usageLimit;
  return this.isActive && isDateValid && isUsageValid;
});

// Method: Check if user can use coupon
couponSchema.methods.canUserUse = function(userId) {
  const userUsage = this.usedBy.filter(u => u.user.toString() === userId.toString());
  return userUsage.length < this.perUserLimit;
};

// Method: Apply coupon to amount
couponSchema.methods.applyDiscount = function(amount) {
  if (amount < this.minimumOrderAmount) {
    return { success: false, message: `Minimum order amount is ${this.minimumOrderAmount}` };
  }
  
  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    if (this.maximumDiscount) {
      discount = Math.min(discount, this.maximumDiscount);
    }
  } else {
    discount = Math.min(this.discountValue, amount);
  }
  
  return {
    success: true,
    discount: Math.round(discount * 100) / 100,
    finalAmount: amount - discount
  };
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;