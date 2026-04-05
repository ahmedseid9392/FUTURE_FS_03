import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiEye, 
  FiTrash2,
  FiAlertCircle
} from 'react-icons/fi';
import { orderService } from '../services/orderService';
import { useCurrencyContext } from '../context/CurrencyContext';
import { useAuthStore } from '../store/authStore';
import ConfirmationModal from '../components/common/ConfirmationModal';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const { formatPrice } = useCurrencyContext();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(),
    enabled: !!user
  });

  // Delete order mutation
  const deleteMutation = useMutation({
    mutationFn: (orderId) => orderService.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-orders']);
      toast.success('Order deleted successfully');
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete order');
    },
  });

  // Handle delete order
  const handleDeleteOrder = () => {
    if (orderToDelete) {
      deleteMutation.mutate(orderToDelete._id);
    }
  };

  // Check if order can be deleted (only canceled orders)
  const canDeleteOrder = (order) => {
    return order.orderStatus === 'cancelled';
  };

  // Handle delete click
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  // Handle view details
  const handleViewDetails = (orderId) => {
    window.location.href = `/orders/${orderId}`;
  };

  // Extract orders from response
  let orders = [];
  let pagination = {};
  
  if (data?.success) {
    if (data.data?.orders) {
      orders = data.data.orders;
      pagination = data.data.pagination || {};
    } else if (data.orders) {
      orders = data.orders;
      pagination = data.pagination || {};
    } else if (Array.isArray(data)) {
      orders = data;
    } else if (data.data && Array.isArray(data.data)) {
      orders = data.data;
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-blue-500" />;
      case 'pending':
      case 'processing':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-500" />;
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-dark-textMuted">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
          Failed to Load Orders
        </h2>
        <p className="text-gray-600 dark:text-dark-textMuted mb-8">
          There was an error loading your orders. Please try again.
        </p>
        <button onClick={() => refetch()} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
          <FiPackage className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
          No Orders Yet
        </h2>
        <p className="text-gray-600 dark:text-dark-textMuted mb-8">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <Link to="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={handleDeleteOrder}
        title="Delete Order"
        message={`Are you sure you want to delete order #${orderToDelete?.orderNumber || orderToDelete?._id?.slice(-8)}? This action cannot be undone.`}
        confirmText="Yes, Delete Order"
        cancelText="Cancel"
        type="danger"
      />

      <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-8">
        My Orders
      </h1>
      
      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-6 border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-textMuted">Order Number</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.orderNumber || order._id?.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-textMuted">Order Date</p>
                  <p className="text-gray-900 dark:text-white">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-textMuted">Total Amount</p>
                  <p className="font-semibold text-boutique-primary">
                    {formatPrice(order.totalAmount || 0)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.orderStatus)}
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-boutique-primary hover:underline flex items-center gap-1 text-sm"
                  >
                    <FiEye className="w-4 h-4" />
                    View Details
                  </Link>
                  
                  {/* Delete Button - Only for canceled orders */}
                  {canDeleteOrder(order) && (
                    <button
                      onClick={() => handleDeleteClick(order)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm transition-colors"
                      title="Delete Order"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-3">
                {order.items?.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                      {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                    </div>
                    <p className="font-medium text-boutique-primary">
                      {formatPrice((item.price || 0) * (item.quantity || 0))}
                    </p>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;