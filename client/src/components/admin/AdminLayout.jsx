import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiUserCheck,
  FiTag
} from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { checkAdminAccess } from '../../utils/checkAdmin';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New order received', message: 'Order #JAMS-001 has been placed', time: '2 min ago', read: false },
    { id: 2, title: 'Low stock alert', message: 'Product "Elegant Dress" is running low', time: '1 hour ago', read: false },
    { id: 3, title: 'New user registered', message: 'John Doe created an account', time: '3 hours ago', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast.success('All notifications marked as read');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
  { name: 'Dashboard', path: '/admin', icon: FiHome, description: 'Overview & Analytics' },
  { name: 'Products', path: '/admin/products', icon: FiPackage, description: 'Manage inventory' },
  { name: 'Orders', path: '/admin/orders', icon: FiShoppingCart, description: 'Track orders' },
  { name: 'Users', path: '/admin/users', icon: FiUsers, description: 'Customer management' },
  { name: 'Coupons', path: '/admin/coupons', icon: FiTag, description: 'Discount coupons' },
  { name: 'Settings', path: '/admin/settings', icon: FiSettings, description: 'System config' },
];

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Show loading while checking admin status
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-boutique-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-dark-textMuted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not admin, show access denied
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-surface">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 max-w-md mx-4"
        >
          <div className="text-7xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-dark-textMuted mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <p className="text-gray-500 mb-6">Your role: <span className="font-semibold">{user.role}</span></p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <FiHome className="w-4 h-4" />
            Go Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-surface">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-dark-card/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          {/* Left side - Menu button and Page Title */}
          <div className="flex items-center gap-3">
            {/* Menu Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-border transition-all"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="text-lg md:text-2xl font-playfair font-bold text-gray-800 dark:text-white">
                {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-dark-textMuted hidden sm:block">
                {navItems.find(item => item.path === location.pathname)?.description || 'Overview & Analytics'}
              </p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-sm focus:outline-none focus:ring-2 focus:ring-boutique-primary w-48 lg:w-64"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
                aria-label="Notifications"
              >
                <FiBell className="w-4 h-4 md:w-5 md:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-72 md:w-80 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden z-50"
                  >
                    <div className="flex justify-between items-center p-3 md:p-4 border-b border-gray-100 dark:border-dark-border">
                      <h3 className="font-semibold text-sm md:text-base">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-boutique-primary hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 md:max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-3 md:p-4 border-b border-gray-100 dark:border-dark-border cursor-pointer transition-colors ${
                            !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-dark-border'
                          }`}
                        >
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-boutique-primary transition-all"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-boutique-primary to-boutique-accent rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <FiChevronDown className={`w-4 h-4 transition-transform hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-dark-textMuted">{user.email}</p>
                      <span className="text-xs text-boutique-primary font-semibold">Administrator</span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiUserCheck className="w-4 h-4" />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiSettings className="w-4 h-4" />
                      <span className="text-sm">Account Settings</span>
                    </Link>
                    <div className="border-t border-gray-100 dark:border-dark-border"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-dark-card shadow-2xl overflow-y-auto"
          >
            {/* Close button inside sidebar */}
            <div className="flex justify-end p-4 border-b border-gray-100 dark:border-dark-border">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-border transition-all"
                aria-label="Close sidebar"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col h-full">
              {/* Logo Area */}
              <div className="p-6 border-b border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-boutique-primary to-boutique-accent rounded-xl flex items-center justify-center shadow-lg">
                    <FiPackage className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-playfair font-bold bg-gradient-to-r from-boutique-primary to-boutique-accent bg-clip-text text-transparent">
                      Admin Panel
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-dark-textMuted">Jams Boutique</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-boutique-primary to-boutique-accent rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-dark-textMuted">{user.email}</p>
                    <span className="text-xs text-boutique-primary font-semibold">Administrator</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                  Main Menu
                </p>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setSidebarOpen(false);
                      }}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-boutique-primary to-boutique-accent text-white shadow-lg'
                          : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <p className="text-xs opacity-75">{item.description}</p>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="w-1 h-8 bg-white rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button at bottom */}
              <div className="p-4 border-t border-gray-100 dark:border-dark-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;