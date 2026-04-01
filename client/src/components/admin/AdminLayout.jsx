import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { checkAdminAccess } from '../../utils/checkAdmin';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Debug admin access
    const isAdmin = checkAdminAccess();
    console.log('AdminLayout - Is Admin?', isAdmin);
    console.log('AdminLayout - User object:', user);
    
    // Check if user is admin
    if (user && user.role !== 'admin') {
      console.log('Access denied: User role is', user.role);
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FiHome },
    { name: 'Products', path: '/admin/products', icon: FiPackage },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingCart },
    { name: 'Users', path: '/admin/users', icon: FiUsers },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  // Show loading while checking admin status
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-primary"></div>
      </div>
    );
  }

  // If not admin, show access denied
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard.</p>
          <p className="text-gray-500 mb-6">Your role: {user.role}</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-dark-card rounded-md shadow-md"
      >
        {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-border">
            <h2 className="text-2xl font-playfair font-bold text-boutique-primary">
              Admin Panel
            </h2>
            <p className="text-sm text-gray-500 dark:text-dark-textMuted mt-1">
              Jams Boutique
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-boutique-primary text-white'
                    : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-boutique-primary rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-dark-textMuted">{user.email}</p>
                <p className="text-xs text-boutique-primary mt-1">Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;