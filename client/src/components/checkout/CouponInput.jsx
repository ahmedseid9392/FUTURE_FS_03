import { useState } from 'react';
import { FiTag, FiCheck, FiX } from 'react-icons/fi';
import { couponService } from '../../services/couponService';
import toast from 'react-hot-toast';

const CouponInput = ({ cartTotal, onCouponApplied }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await couponService.validateCoupon(couponCode, cartTotal);
      
      if (result.success) {
        setAppliedCoupon(result.data.coupon);
        onCouponApplied(result.data.coupon);
        toast.success(`Coupon applied! You saved ${result.data.coupon.discountAmount} ETB`);
        setCouponCode('');
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      setError('Failed to apply coupon');
      toast.error('Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    onCouponApplied(null);
    toast.info('Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
              <FiCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-400">
                Coupon Applied!
              </p>
              <p className="text-sm text-green-700 dark:text-green-500">
                {appliedCoupon.discountType === 'percentage' 
                  ? `${appliedCoupon.discountValue}% OFF` 
                  : `${appliedCoupon.discountAmount} ETB OFF`}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Code: {appliedCoupon.code}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="p-1 text-green-600 hover:text-red-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-dark-border rounded-lg p-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
        Have a coupon code?
      </label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={handleApplyCoupon}
          disabled={loading}
          className="btn-secondary px-6 whitespace-nowrap"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <p className="text-xs text-gray-500 mt-2">
        Terms and conditions apply. Cannot be combined with other offers.
      </p>
    </div>
  );
};

export default CouponInput;