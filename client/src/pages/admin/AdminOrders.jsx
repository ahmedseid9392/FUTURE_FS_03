import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FiEye, 
  FiSearch, 
  FiPackage, 
  FiDollarSign, 
  FiUsers, 
  FiTrendingUp,
  FiCalendar,
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { orderService } from '../../services/orderService';
import { useCurrencyContext } from '../../context/CurrencyContext';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [paymentFilter, setPaymentFilter] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  const { formatPrice } = useCurrencyContext();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', page, statusFilter, searchTerm, dateRange, paymentFilter, sortBy, itemsPerPage],
    queryFn: () => orderService.getAll({ 
      page, 
      limit: itemsPerPage, 
      status: statusFilter, 
      search: searchTerm,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      paymentStatus: paymentFilter,
      sort: sortBy
    }),
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await orderService.updateStatus(orderId, { status: newStatus });
      if (result.success) {
        toast.success(`Order status updated to ${newStatus}`);
        refetch();
      } else {
        toast.error(result.message || 'Failed to update order status');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
    setDateRange({ startDate: '', endDate: '' });
    setPaymentFilter('');
    setSortBy('-createdAt');
    setPage(1);
  };

  const orders = data?.success ? (data.orders || data.data?.orders || []) : [];
  const pagination = data?.success ? (data.pagination || data.data?.pagination || { page: 1, pages: 1, total: 0 }) : { page: 1, pages: 1, total: 0 };

  const statusOptions = [
    { value: '', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'processing', label: 'Processing', color: 'blue' },
    { value: 'confirmed', label: 'Confirmed', color: 'purple' },
    { value: 'shipped', label: 'Shipped', color: 'indigo' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  const paymentOptions = [
    { value: '', label: 'All Payments' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-totalAmount', label: 'Highest Amount' },
    { value: 'totalAmount', label: 'Lowest Amount' }
  ];

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length;
  const completedOrders = orders.filter(order => order.orderStatus === 'delivered').length;
  const activeFiltersCount = [
    statusFilter, 
    searchTerm, 
    dateRange.startDate, 
    dateRange.endDate, 
    paymentFilter,
    sortBy !== '-createdAt'
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
          Orders
        </h1>
        <p className="text-gray-600 dark:text-dark-textMuted">
          Manage and track customer orders
        </p>
      </div>

      {/* Stats Cards with Hover Effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{pagination.total || 0}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            vs last month +12%
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            +8% from last month
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Needs attention
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <FiUsers className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Successfully delivered
          </div>
        </motion.div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border mb-6">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-boutique-primary text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              {showAdvancedFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Order Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input-field"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Payment Status
                    </label>
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="input-field"
                    >
                      {paymentOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range - Start */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      From Date
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  {/* Date Range - End */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      To Date
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input-field"
                    >
                      {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Items Per Page */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Items Per Page
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="input-field"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-dark-border">
                    <div className="flex flex-wrap gap-2">
                      {statusFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          Status: {statusFilter}
                          <button onClick={() => setStatusFilter('')} className="hover:text-red-500">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {paymentFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          Payment: {paymentFilter}
                          <button onClick={() => setPaymentFilter('')} className="hover:text-red-500">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {dateRange.startDate && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          From: {dateRange.startDate}
                          <button onClick={() => setDateRange(prev => ({ ...prev, startDate: '' }))} className="hover:text-red-500">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {dateRange.endDate && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          To: {dateRange.endDate}
                          <button onClick={() => setDateRange(prev => ({ ...prev, endDate: '' }))} className="hover:text-red-500">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {searchTerm && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          Search: {searchTerm}
                          <button onClick={() => setSearchTerm('')} className="hover:text-red-500">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      <button
                        onClick={handleClearFilters}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {orders.length} of {pagination.total} orders
        </p>
      </div>

      {/* Orders Cards Grid with Hover Effect */}
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => handleViewDetails(order)}
          >
            <div className="p-4">
              <div className="flex flex-wrap justify-between items-start gap-4">
                {/* Left Section - Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-boutique-primary">
                      #{order.orderNumber || order._id?.slice(-8)}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.orderStatus?.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.shippingAddress?.fullName || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.shippingAddress?.email || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                {/* Middle Section - Items Summary */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FiPackage className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {order.items?.length || 0} items
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-xs text-gray-500 bg-gray-100 dark:bg-dark-surface px-2 py-1 rounded">
                        {item.name?.substring(0, 20)}...
                      </span>
                    ))}
                    {order.items?.length > 3 && (
                      <span className="text-xs text-gray-400">+{order.items.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Right Section - Total & Action */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-boutique-primary">
                    {formatPrice(order.totalAmount || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment: {order.paymentMethod}
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(order);
                      }}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
          <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-dark-text mb-2">
            No orders found
          </h3>
          <p className="text-gray-500">No orders match your search criteria</p>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="mt-4 text-boutique-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    page === pageNum
                      ? 'bg-boutique-primary text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-surface'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminOrders;