import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const userId = req.user.id;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }
    
    if (!coupon.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired or is no longer valid'
      });
    }
    
    if (!coupon.canUserUse(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already used this coupon the maximum number of times'
      });
    }
    
    const result = coupon.applyDiscount(cartTotal);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount: result.discount,
          finalAmount: result.finalAmount,
          description: coupon.description
        }
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Apply coupon to order
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = async (req, res) => {
  try {
    const { code, orderId, cartTotal } = req.body;
    const userId = req.user.id;
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }
    
    if (!coupon.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired or is no longer valid'
      });
    }
    
    if (!coupon.canUserUse(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already used this coupon the maximum number of times'
      });
    }
    
    const result = coupon.applyDiscount(cartTotal);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
    // Update order with coupon
    const order = await Order.findById(orderId);
    if (order) {
      order.discount = result.discount;
      order.couponCode = coupon.code;
      order.totalAmount = result.finalAmount;
      await order.save();
    }
    
    res.status(200).json({
      success: true,
      data: {
        discount: result.discount,
        finalAmount: result.finalAmount,
        couponCode: coupon.code
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: coupons
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      perUserLimit,
      startDate,
      endDate,
      applicableProducts,
      applicableCategories
    } = req.body;
    
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }
    
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumOrderAmount: minimumOrderAmount || 0,
      maximumDiscount,
      usageLimit,
      perUserLimit: perUserLimit || 1,
      startDate,
      endDate,
      applicableProducts,
      applicableCategories,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully'
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: coupon,
      message: 'Coupon updated successfully'
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get coupon stats (Admin)
// @route   GET /api/coupons/stats
// @access  Private/Admin
export const getCouponStats = async (req, res) => {
  try {
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ isActive: true, endDate: { $gte: new Date() } });
    const expiredCoupons = await Coupon.countDocuments({ endDate: { $lt: new Date() } });
    const totalUsed = await Coupon.aggregate([
      { $group: { _id: null, total: { $sum: '$usedCount' } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        totalUsed: totalUsed[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get coupon stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};