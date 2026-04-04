import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiBarChart2,
  FiPieChart,
  FiCalendar,
  FiClock,
  FiPercent,
  FiAward
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import { useCurrencyContext } from '../../context/CurrencyContext';
import { useAuthStore } from '../../store/authStore';

// Simple Chart Components (no external dependencies)
const SimpleBarChart = ({ data, title, color = '#D4AF37' }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-600 dark:text-dark-textMuted mb-3">{title}</p>
      <div className="flex items-end gap-2 h-48">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
              style={{ 
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: color,
                minHeight: '4px'
              }}
            />
            <span className="text-xs text-gray-500 rotate-45 origin-top-left -ml-2">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SimpleLineChart = ({ data, title, color = '#D4AF37' }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.value / maxValue) * 100}`).join(' ');
  
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-600 dark:text-dark-textMuted mb-3">{title}</p>
      <div className="relative h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="transition-all duration-500"
          />
          {data.map((d, i) => (
            <circle
              key={i}
              cx={(i / (data.length - 1)) * 100}
              cy={100 - (d.value / maxValue) * 100}
              r="2"
              fill={color}
              className="transition-all duration-500"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-2">
        {data.map((item, idx) => (
          <span key={idx} className="text-xs text-gray-500">{item.label}</span>
        ))}
      </div>
    </div>
  );
};

const SimplePieChart = ({ data, title }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-600 dark:text-dark-textMuted mb-3">{title}</p>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {data.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              const endAngle = startAngle + angle;
              currentAngle = endAngle;
              
              const startRad = (startAngle - 90) * Math.PI / 180;
              const endRad = (endAngle - 90) * Math.PI / 180;
              
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              const largeArc = angle > 180 ? 1 : 0;
              
              return (
                <path
                  key={idx}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                />
              );
            })}
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-600 dark:text-dark-textMuted">{item.label}</span>
              <span className="ml-auto font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { formatPrice } = useCurrencyContext();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    averageOrderValue: 0,
    conversionRate: 0
  });
  
  const [dailyOrders, setDailyOrders] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

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
    const products = productsData?.data?.products || [];
    const orders = ordersData?.data?.orders || [];
    const users = usersData?.data?.users || [];

    // Calculate basic stats
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length;
    const lowStockProducts = products.filter(product => product.stock > 0 && product.stock <= 5).length;
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    // Calculate conversion rate (orders / total visitors - approximated)
    const conversionRate = users.length > 0 ? (orders.length / users.length) * 100 : 0;

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      averageOrderValue,
      conversionRate
    });

    // Calculate daily orders for last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const dailyOrderCount = last7Days.map(day => ({
      label: day.slice(5),
      value: orders.filter(order => order.createdAt?.split('T')[0] === day).length
    }));
    setDailyOrders(dailyOrderCount);

    // Calculate category distribution
    const categoryMap = new Map();
    products.forEach(product => {
      const cat = product.category || 'uncategorized';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });
    const categoryColors = ['#D4AF37', '#2C1810', '#9C6E3E', '#4A90E2', '#E74C3C', '#2ECC71', '#F39C12'];
    const categoryData = Array.from(categoryMap.entries()).map(([label, value], idx) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value,
      color: categoryColors[idx % categoryColors.length]
    }));
    setCategoryDistribution(categoryData);

    // Calculate monthly revenue for last 6 months
    const last6Months = [...Array(6)].map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return { month: date.toLocaleString('default', { month: 'short' }), year: date.getFullYear() };
    }).reverse();
    
    const monthlyRevenueData = last6Months.map(month => {
      const revenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === new Date(`${month.month} 1, ${month.year}`).getMonth() &&
                 orderDate.getFullYear() === month.year;
        })
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      return { label: month.month, value: revenue };
    });
    setMonthlyRevenue(monthlyRevenueData);

    // Calculate top 5 products by sales
    const productSales = new Map();
    orders.forEach(order => {
      order.items?.forEach(item => {
        const name = item.name;
        productSales.set(name, (productSales.get(name) || 0) + (item.quantity || 0));
      });
    });
    const topProductsData = Array.from(productSales.entries())
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    setTopProducts(topProductsData);
    
  }, [productsData, ordersData, usersData]);

  const isLoading = productsLoading || ordersLoading || usersLoading;

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FiPackage,
      color: 'bg-blue-500',
      link: '/admin/products',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiShoppingCart,
      color: 'bg-green-500',
      link: '/admin/orders',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'bg-purple-500',
      link: '/admin/users',
      change: '+23%',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      link: '/admin/orders',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Avg. Order Value',
      value: formatPrice(stats.averageOrderValue),
      icon: FiPercent,
      color: 'bg-indigo-500',
      link: '/admin/orders',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: FiTrendingUp,
      color: 'bg-teal-500',
      link: '/admin/analytics',
      change: '+2%',
      trend: 'up'
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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-dark-textMuted">
          Welcome back, {user?.name}! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-border hover:shadow-md transition-all"
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
            <div className="mt-4 flex items-center justify-between">
              <Link
                to={stat.link}
                className="inline-flex items-center text-sm text-boutique-primary hover:underline"
              >
                View Details
                <FiArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                <span>{stat.change}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders Chart */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiBarChart2 className="w-5 h-5 text-boutique-primary" />
              Daily Orders (Last 7 Days)
            </h2>
            <FiCalendar className="w-4 h-4 text-gray-400" />
          </div>
          <SimpleBarChart 
            data={dailyOrders} 
            title="Number of orders per day"
            color="#D4AF37"
          />
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-boutique-primary" />
              Monthly Revenue (Last 6 Months)
            </h2>
            <FiDollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <SimpleLineChart 
            data={monthlyRevenue} 
            title="Revenue trend over time"
            color="#D4AF37"
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-dark-textMuted">
              Total: {formatPrice(monthlyRevenue.reduce((sum, m) => sum + m.value, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiPieChart className="w-5 h-5 text-boutique-primary" />
              Product Categories
            </h2>
            <FiPackage className="w-4 h-4 text-gray-400" />
          </div>
          <SimplePieChart 
            data={categoryDistribution} 
            title="Products by category"
          />
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiAward className="w-5 h-5 text-boutique-primary" />
              Top Selling Products
            </h2>
            <FiShoppingCart className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No sales data yet</p>
            ) : (
              topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-surface rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-boutique-primary">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} units sold</p>
                    </div>
                  </div>
                  <FiTrendingUp className="w-4 h-4 text-green-500" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="w-5 h-5 text-boutique-primary" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          </div>
          <Link to="/admin/orders" className="text-boutique-primary hover:underline text-sm flex items-center gap-1">
            View All
            <FiArrowRight className="w-4 h-4" />
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-dark-text">
                      {order.orderNumber || order._id?.slice(-8)}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-800 dark:text-white">{order.shippingAddress?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{order.shippingAddress?.email || 'N/A'}</p>
                      </div>
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
                      <div className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/orders?order=${order._id}`}
                        className="text-boutique-primary hover:underline text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/admin/products/new"
          className="bg-gradient-to-r from-boutique-primary to-boutique-accent text-white p-4 rounded-lg text-center hover:shadow-lg transition-all hover:scale-105"
        >
          <FiPackage className="w-6 h-6 mx-auto mb-2" />
          <p className="font-medium">Add Product</p>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all hover:scale-105"
        >
          <FiShoppingCart className="w-6 h-6 mx-auto mb-2" />
          <p className="font-medium">Manage Orders</p>
        </Link>
        <Link
          to="/admin/users"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all hover:scale-105"
        >
          <FiUsers className="w-6 h-6 mx-auto mb-2" />
          <p className="font-medium">View Users</p>
        </Link>
        <Link
          to="/admin/settings"
          className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all hover:scale-105"
        >
          <FiDollarSign className="w-6 h-6 mx-auto mb-2" />
          <p className="font-medium">Settings</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;