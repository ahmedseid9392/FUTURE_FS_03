import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  FiTruck, 
  FiLock, 
  FiShield, 
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiHome,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLoader
} from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import { useCurrencyContext } from '../context/CurrencyContext';
import { useAuthStore } from '../store/authStore';
import orderService from '../services/orderService';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';
import CheckoutGuard from '../components/checkout/CheckoutGuard';
import CouponInput from '../components/checkout/CouponInput';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Phone number is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(3, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  paymentMethod: z.enum(['cash', 'chapa'], {
    required_error: 'Please select a payment method'
  }),
  notes: z.string().optional()
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, clearCart, getSubtotal, getShipping, getTax, getTotal } = useCartStore();
  const { formatPrice } = useCurrencyContext();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'Ethiopia',
      paymentMethod: 'cash',
      notes: ''
    }
  });
  
  const selectedPaymentMethod = watch('paymentMethod');
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = subtotal + shipping + tax - discountAmount;
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      toast.error('Your cart is empty');
      navigate('/shop');
    }
  }, [items.length, navigate, orderPlaced]);

  const handleCouponApplied = (coupon) => {
    if (coupon) {
      setAppliedCoupon(coupon);
      setDiscountAmount(coupon.discountAmount);
    } else {
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };
  
  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setLoading(true);
    
    const orderData = {
      items: items.map(item => ({
        product: item._id,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor
      })),
      shippingAddress: {
        fullName: data.fullName,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        phone: data.phone,
        email: data.email
      },
      paymentMethod: data.paymentMethod,
      notes: data.notes
    };
    
    try {
      console.log('Creating order with data:', orderData);
      
      const result = await orderService.create(orderData);
      
      console.log('Full API response:', result);
      
      if (result.success) {
        const orderId = result.data?.order?._id || result.order?._id || result.data?._id;
        const orderNumberValue = result.data?.order?.orderNumber || result.order?.orderNumber || result.data?.orderNumber;
        
        console.log('Order ID:', orderId);
        console.log('Order Number:', orderNumberValue);
        
        if (data.paymentMethod === 'chapa') {
          if (!orderId) {
            console.error('No order ID found in response:', result);
            toast.error('Failed to get order ID');
            setLoading(false);
            return;
          }
          
          console.log('Initiating Chapa payment for order:', orderId);
          setProcessingPayment(true);
          
          const paymentResult = await paymentService.initiatePayment(orderId);
          console.log('Payment result:', paymentResult);
          
          if (paymentResult.success && paymentResult.data?.checkout_url) {
            console.log('Redirecting to Chapa:', paymentResult.data.checkout_url);
            window.location.href = paymentResult.data.checkout_url;
          } else {
            toast.error(paymentResult.message || 'Failed to initiate payment');
            setProcessingPayment(false);
            setLoading(false);
          }
        } else {
          // Cash on delivery
          setOrderNumber(orderNumberValue || 'N/A');
          setOrderPlaced(true);
          clearCart();
          toast.success('Order placed successfully!');
        }
      } else {
        toast.error(result.message || 'Failed to place order');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
      setLoading(false);
    }
  };
  
  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
            Order Placed Successfully!
          </h2>
          
          <p className="text-gray-600 dark:text-dark-textMuted mb-4">
            Thank you for your purchase
          </p>
          
          <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 dark:text-dark-textMuted">Order Number</p>
            <p className="text-lg font-semibold text-boutique-primary">{orderNumber}</p>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-dark-textMuted mb-6">
            A confirmation email has been sent to your email address.
            You can track your order status in your account.
          </p>
          
          <div className="space-y-3">
            <Link to="/orders" className="btn-primary w-full block text-center">
              View My Orders
            </Link>
            <Link to="/shop" className="btn-outline w-full block text-center">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/cart" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-boutique-primary transition-colors mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
          Checkout
        </h1>
        <p className="text-gray-600 dark:text-dark-textMuted">
          Complete your purchase by filling out the information below
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiTruck className="w-5 h-5 text-boutique-primary" />
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ... shipping fields ... */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register('fullName')}
                      className="input-field pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      {...register('email')}
                      className="input-field pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="input-field pl-10"
                      placeholder="+251 911 234 567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Street Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register('street')}
                      className="input-field pl-10"
                      placeholder="123 Main St"
                    />
                  </div>
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className="input-field"
                    placeholder="Addis Ababa"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className="input-field"
                    placeholder="Addis Ababa"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    {...register('zipCode')}
                    className="input-field"
                    placeholder="1000"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    {...register('country')}
                    className="input-field"
                    placeholder="Ethiopia"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Coupon Input */}
            <div>
              <CouponInput 
                cartTotal={subtotal} 
                onCouponApplied={handleCouponApplied} 
              />
            </div>
            
            {/* Payment Method */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiCreditCard className="w-5 h-5 text-boutique-primary" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                  <input
                    type="radio"
                    value="cash"
                    {...register('paymentMethod')}
                    className="w-4 h-4 text-boutique-primary"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-dark-textMuted">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                  <input
                    type="radio"
                    value="chapa"
                    {...register('paymentMethod')}
                    className="w-4 h-4 text-boutique-primary"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <FiCreditCard className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Chapa Payment</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-dark-textMuted">
                      Pay with CBE Birr (13-digit account), Tele Birr, Amole
                    </p>
                  </div>
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-2">{errors.paymentMethod.message}</p>
              )}
            </div>
            
            {/* Order Notes */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Order Notes (Optional)
              </h2>
              <textarea
                {...register('notes')}
                rows="3"
                className="input-field"
                placeholder="Special instructions for delivery..."
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || processingPayment}
              className="btn-primary w-full py-3 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processingPayment ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Redirecting to Chapa Payment...
                </>
              ) : loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : selectedPaymentMethod === 'chapa' ? (
                <>
                  <FiCreditCard className="w-5 h-5" />
                  Pay with Chapa - {formatPrice(total)}
                </>
              ) : (
                <>
                  <FiDollarSign className="w-5 h-5" />
                  Place Order - {formatPrice(total)}
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Order Summary
            </h2>
            
            {/* Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={`${item._id}-${item.selectedSize}`} className="flex gap-3">
                  <img
                    src={item.images?.[0]?.url || 'https://via.placeholder.com/50'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-boutique-primary">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-dark-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-textMuted">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-textMuted">Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-textMuted">Tax (2%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-dark-border pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-boutique-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            {/* CBE Account Info */}
            {selectedPaymentMethod === 'chapa' && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-400 font-medium mb-1">
                  ℹ️ CBE Birr Payment Info:
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-500">
                  You'll need your 13-digit CBE account number (e.g., 1000134567890)
                </p>
              </div>
            )}
            
            {/* Security Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-dark-textMuted">
                <FiShield className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>
              <p className="text-xs text-center text-gray-400 mt-2">
                Your information is protected by SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap with CheckoutGuard
const ProtectedCheckoutPage = () => {
  return (
    <CheckoutGuard>
      <CheckoutPage />
    </CheckoutGuard>
  );
};

export default ProtectedCheckoutPage;