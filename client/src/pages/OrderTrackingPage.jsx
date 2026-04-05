import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiCheckCircle, 
  FiTruck, 
  FiClock,
  FiMapPin,
  FiCalendar,
  FiMail,
  FiPhone,
  FiSearch,
  FiAlertCircle,
  FiBox
} from 'react-icons/fi';
import { trackingService } from '../services/trackingService';
import { useCurrencyContext } from '../context/CurrencyContext';
import { useAuthStore } from '../store/authStore';

// Helper functions outside components
const getStatusIcon = (status) => {
  switch (status) {
    case 'delivered':
      return <FiCheckCircle className="w-8 h-8 text-green-500" />;
    case 'shipped':
    case 'out_for_delivery':
      return <FiTruck className="w-8 h-8 text-blue-500" />;
    case 'processing':
    case 'confirmed':
      return <FiPackage className="w-8 h-8 text-yellow-500" />;
    case 'cancelled':
      return <FiAlertCircle className="w-8 h-8 text-red-500" />;
    default:
      return <FiClock className="w-8 h-8 text-gray-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    case 'shipped':
    case 'out_for_delivery':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
    case 'confirmed':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
    case 'processing':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'pending':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

// Tracking Result Component
const TrackingResult = ({ trackingInfo, formatPrice }) => {
  const { order, timeline, estimatedDelivery, trackingNumber } = trackingInfo;
  const currentStatus = order.orderStatus;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Order Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
          Order Tracking
        </h1>
        <p className="text-gray-600 dark:text-dark-textMuted">
          Track your order status in real-time
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="text-gray-900 dark:text-white">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-bold text-boutique-primary">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
          <div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(currentStatus)}`}>
              {currentStatus?.toUpperCase()}
            </span>
          </div>
        </div>
        
        {trackingNumber && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
            <p className="text-sm text-gray-500">Tracking Number</p>
            <p className="font-mono text-sm">{trackingNumber}</p>
          </div>
        )}
        
        {estimatedDelivery && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              Estimated Delivery
            </p>
            <p className="font-semibold text-green-600">
              {new Date(estimatedDelivery).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Order Timeline
        </h2>
        
        <div className="relative">
          {timeline && timeline.map((step, index) => (
            <div key={step.status} className="flex mb-8 last:mb-0">
              {/* Timeline Line */}
              <div className="relative mr-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-boutique-primary text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.completed ? (
                    <FiCheckCircle className="w-5 h-5" />
                  ) : (
                    getStatusIcon(step.status.toLowerCase())
                  )}
                </div>
                {index < timeline.length - 1 && (
                  <div className={`absolute top-10 left-5 w-0.5 h-16 ${
                    step.completed && timeline[index + 1]?.completed
                      ? 'bg-boutique-primary'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 pb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {step.status}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                {step.date && (
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(step.date).toLocaleString()}
                  </p>
                )}
                {step.location && (
                  <p className="text-xs text-boutique-primary mt-1 flex items-center gap-1">
                    <FiMapPin className="w-3 h-3" />
                    {step.location}
                  </p>
                )}
                {step.trackingNumber && (
                  <p className="text-xs text-boutique-primary mt-1">
                    Tracking: {step.trackingNumber}
                  </p>
                )}
                {step.estimatedDelivery && (
                  <p className="text-xs text-green-600 mt-1">
                    Est. Delivery: {new Date(step.estimatedDelivery).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Need Help Section */}
      <div className="mt-8 bg-gray-50 dark:bg-dark-surface rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Need Help?
        </h3>
        <p className="text-gray-600 dark:text-dark-textMuted mb-4">
          If you have any questions about your order, please contact our support team
        </p>
        <div className="flex justify-center gap-4">
          <a href="mailto:support@jamsboutique.com" className="text-boutique-primary hover:underline">
            support@jamsboutique.com
          </a>
          <span className="text-gray-400">|</span>
          <a href="tel:+251911234567" className="text-boutique-primary hover:underline">
            +251 911 234 567
          </a>
        </div>
      </div>
    </div>
  );
};

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { formatPrice } = useCurrencyContext();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingEmail, setTrackingEmail] = useState('');
  const [guestTracking, setGuestTracking] = useState(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState('');

  // Fetch tracking info for logged-in user
  const { data, isLoading, error } = useQuery({
    queryKey: ['tracking', orderId],
    queryFn: () => trackingService.getTrackingInfo(orderId),
    enabled: !!orderId && isAuthenticated
  });

  const trackingInfo = data?.success ? data.data : null;

  const handleGuestTracking = async (e) => {
    e.preventDefault();
    if (!trackingNumber || !trackingEmail) {
      setGuestError('Please enter both order number and email');
      return;
    }
    
    setGuestLoading(true);
    setGuestError('');
    
    const result = await trackingService.trackOrder(trackingNumber, trackingEmail);
    if (result.success) {
      setGuestTracking(result.data);
    } else {
      setGuestError(result.message || 'Order not found. Please check your information.');
    }
    setGuestLoading(false);
  };

  // If not logged in and no orderId, show guest tracking form
  if (!isAuthenticated && !orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <FiSearch className="w-16 h-16 mx-auto text-boutique-primary mb-4" />
          <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600 dark:text-dark-textMuted">
            Enter your order number and email to track your order
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
          <form onSubmit={handleGuestTracking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Order Number
              </label>
              <input
                type="text"
                placeholder="e.g., JAMS-20241201-1234"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter the email used for order"
                value={trackingEmail}
                onChange={(e) => setTrackingEmail(e.target.value)}
                className="input-field"
              />
            </div>
            {guestError && (
              <p className="text-red-500 text-sm">{guestError}</p>
            )}
            <button
              type="submit"
              disabled={guestLoading}
              className="btn-primary w-full py-3"
            >
              {guestLoading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>

        {guestTracking && (
          <TrackingResult trackingInfo={guestTracking} formatPrice={formatPrice} />
        )}
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-primary"></div>
      </div>
    );
  }

  // Error state
  if (error || !trackingInfo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <FiAlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-600 dark:text-dark-textMuted mb-6">
          We couldn't find your order. Please check the order number and try again.
        </p>
        <button onClick={() => navigate('/orders')} className="btn-primary">
          View My Orders
        </button>
      </div>
    );
  }

  return <TrackingResult trackingInfo={trackingInfo} formatPrice={formatPrice} />;
};

export default OrderTrackingPage;