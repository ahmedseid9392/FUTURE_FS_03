import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiMapPin, 
  FiUser, 
  FiMail, 
  FiPhone,
  FiCreditCard,
  FiDollarSign,
  FiPrinter,
  FiDownload,
  FiAlertCircle
} from 'react-icons/fi';
import { orderService } from '../services/orderService';
import { useCurrencyContext } from '../context/CurrencyContext';
import { useAuthStore } from '../store/authStore';
import ConfirmationModal from '../components/common/ConfirmationModal';
import toast from 'react-hot-toast';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { formatPrice } = useCurrencyContext();
  const [cancelling, setCancelling] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id),
    enabled: !!id && !!user
  });
  
  // Extract order from response
  const order = data?.success ? data.order || data.data?.order : null;
  
  console.log('Order details:', order);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'shipped':
        return <FiTruck className="w-6 h-6 text-blue-500" />;
      case 'pending':
      case 'processing':
        return <FiClock className="w-6 h-6 text-yellow-500" />;
      default:
        return <FiPackage className="w-6 h-6 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'shipped':
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
  
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const result = await orderService.cancel(id, 'Cancelled by customer');
      if (result.success) {
        toast.success('Order cancelled successfully');
        setIsCancelModalOpen(false);
        refetch();
      } else {
        toast.error(result.message || 'Failed to cancel order');
      }
    } catch (error) {
      toast.error('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-dark-textMuted">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
          Order Not Found
        </h2>
        <p className="text-gray-600 dark:text-dark-textMuted mb-8">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link to="/orders" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>
    );
  }
  
  const canCancel = order.orderStatus === 'pending' || order.orderStatus === 'processing';
  const isDelivered = order.orderStatus === 'delivered';
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Cancel Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        title="Cancel Order"
        message={`Are you sure you want to cancel order #${order.orderNumber || order._id?.slice(-8)}? This action cannot be undone.`}
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep Order"
        type="danger"
      />
      
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/orders" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-boutique-primary transition-colors mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 dark:text-white">
              Order Details
            </h1>
            <p className="text-gray-500 dark:text-dark-textMuted mt-1">
              Order #{order.orderNumber || order._id?.slice(-8)}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-boutique-primary transition-colors"
              title="Print Order"
            >
              <FiPrinter className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-boutique-primary transition-colors"
              title="Download Invoice"
            >
              <FiDownload className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Order Status Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          {getStatusIcon(order.orderStatus)}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Status</h2>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus?.toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Status Timeline */}
        <div className="mt-6">
          <div className="flex justify-between">
            <div className="text-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                order.orderStatus !== 'cancelled' ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <FiCheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-gray-600 dark:text-dark-textMuted">Order Placed</p>
              <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                order.orderStatus === 'processing' || order.orderStatus === 'confirmed' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
                  ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <FiClock className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-gray-600 dark:text-dark-textMuted">Processing</p>
            </div>
            <div className="text-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
                  ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <FiTruck className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-gray-600 dark:text-dark-textMuted">Shipped</p>
            </div>
            <div className="text-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                order.orderStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <FiPackage className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-gray-600 dark:text-dark-textMuted">Delivered</p>
            </div>
          </div>
        </div>
        
        {/* Cancel Button */}
        {canCancel && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-border">
            <button
              onClick={() => setIsCancelModalOpen(true)}
              disabled={cancelling}
              className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 disabled:opacity-50 transition-colors"
            >
              {cancelling ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <FiAlertCircle className="w-4 h-4" />
              )}
              Cancel Order
            </button>
          </div>
        )}
      </motion.div>
      
      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden mb-6"
      >
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Items</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-dark-border">
          {order.items?.map((item, index) => (
            <div key={index} className="p-6 flex gap-4">
              <img
                src={item.image || 'https://via.placeholder.com/80'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <Link 
                  to={`/product/${item.product?._id || item.product}`}
                  className="font-medium text-gray-900 dark:text-white hover:text-boutique-primary transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-dark-textMuted mt-1">
                  Quantity: {item.quantity}
                </p>
                {item.size && (
                  <p className="text-xs text-gray-400">Size: {item.size}</p>
                )}
                {item.color && (
                  <p className="text-xs text-gray-400">Color: {item.color}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-boutique-primary">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPrice(item.price)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Order Summary & Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiMapPin className="w-5 h-5 text-boutique-primary" />
            Shipping Information
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <FiUser className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {order.shippingAddress?.fullName}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <FiMail className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-dark-textMuted">
                {order.shippingAddress?.email}
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <FiPhone className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-dark-textMuted">
                {order.shippingAddress?.phone}
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-dark-textMuted">
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                {order.shippingAddress?.country}
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Payment & Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiCreditCard className="w-5 h-5 text-boutique-primary" />
            Payment Summary
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-textMuted">Payment Method</span>
              <span className="font-medium capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-textMuted">Payment Status</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus?.toUpperCase()}
              </span>
            </div>
            
            <div className="border-t border-gray-200 dark:border-dark-border pt-3 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-textMuted">Subtotal</span>
                <span>{formatPrice(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-dark-textMuted">Shipping</span>
                <span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost || 0)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-dark-textMuted">Tax</span>
                <span>{formatPrice(order.tax || 0)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-dark-border pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-boutique-primary">{formatPrice(order.totalAmount || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Order Notes */}
      {order.notes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Order Notes</h2>
          <p className="text-gray-600 dark:text-dark-textMuted">{order.notes}</p>
        </motion.div>
      )}
      
      {/* Order Timeline History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Timeline</h2>
          <div className="space-y-4">
            {order.statusHistory.map((history, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 mt-2 bg-boutique-primary rounded-full"></div>
                  {index < order.statusHistory.length - 1 && (
                    <div className="w-0.5 h-full ml-0.5 bg-gray-300 dark:bg-dark-border"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{history.status}</p>
                  <p className="text-sm text-gray-500">{history.note}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(history.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderDetailsPage;