import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiLoader, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const PaymentStatusPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('status');
    const orderIdParam = params.get('order_id');
    const errorMessage = params.get('message');

    setOrderId(orderIdParam);
    setStatus(paymentStatus);

    if (paymentStatus === 'success') {
      clearCart();
      toast.success('Payment successful! Your order has been confirmed.');
    } else if (paymentStatus === 'failed') {
      toast.error(errorMessage || 'Payment failed. Please try again.');
    }

    setLoading(false);
  }, [location, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-16 h-16 text-boutique-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-dark-textMuted">Processing payment status...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h2>
          
          <p className="text-gray-600 dark:text-dark-textMuted mb-6">
            Your payment has been processed successfully. Your order has been confirmed.
          </p>
          
          <div className="space-y-3">
            <Link
              to={`/orders`}
              className="btn-primary w-full block text-center"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="btn-outline w-full block text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiXCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
          Payment Failed
        </h2>
        
        <p className="text-gray-600 dark:text-dark-textMuted mb-6">
          Your payment could not be processed. Please try again or choose a different payment method.
        </p>
        
        <div className="space-y-3">
          {orderId && (
            <Link
              to={`/checkout`}
              className="btn-primary w-full block text-center"
            >
              Try Again
            </Link>
          )}
          <Link
            to="/cart"
            className="btn-outline w-full block text-center"
          >
            Back to Cart
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentStatusPage;