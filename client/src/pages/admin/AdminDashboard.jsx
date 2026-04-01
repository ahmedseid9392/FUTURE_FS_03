import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import { useCurrencyContext } from '../../context/CurrencyContext';
import { useAuthStore } from '../../store/authStore';

const AdminDashboard = () => {
  const { formatPrice } = useCurrencyContext();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });

  // Debug admin access
  useEffect(() => {
    console.log('AdminDashboard - Current user:', user);
    console.log('AdminDashboard - User role:', user?.role);
    console.log('AdminDashboard - Is admin?', user?.role === 'admin');
  }, [user]);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products-stats'],
    queryFn: () => productService.getAll({ limit: 1000 }),
  });

  // Fetch orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders-stats'],
    queryFn: () => orderService.getAll({ limit: 1000 }),
  });

  // Fetch users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-stats'],
    queryFn: () => userService.getAll({ limit: 1000 }),
  });

  useEffect(() => {
    // Safely extract data with fallbacks
    const products = productsData?.data?.products || [];
    const orders = ordersData?.data?.orders || [];
    const users = usersData?.data?.users || [];

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length;
    const lowStockProducts = products.filter(product => product.stock > 0 && product.stock <= 5).length;

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue,
      pendingOrders,
      lowStockProducts
    });
  }, [productsData, ordersData, usersData]);

  const isLoading = productsLoading || ordersLoading || usersLoading;

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FiPackage,
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiShoppingCart,
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'bg-purple-500',
      link: '/admin/users'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      link: '/admin/orders'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      link: '/admin/orders?status=pending'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockProducts,
      icon: FiTrendingDown,
      color: 'bg-red-500',
      link: '/admin/products?lowStock=true'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-primary"></div>
      </div>
    );
  }

  const recentOrders = ordersData?.data?.orders?.slice(0, 5) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-dark-textMuted">
          Welcome back, {user?.name}! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-dark-textMuted mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <Link
              to={stat.link}
              className="mt-4 inline-flex items-center text-sm text-boutique-primary hover:underline"
            >
              View Details
              <FiArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link to="/admin/orders" className="text-boutique-primary hover:underline text-sm">
            View All
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <FiShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-dark-textMuted">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                 </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface">
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-text">
                      {order.orderNumber || order._id?.slice(-8)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-text">
                      {order.shippingAddress?.fullName || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-boutique-primary">
                      {formatPrice(order.totalAmount || 0)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-700' :
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.orderStatus || 'pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;