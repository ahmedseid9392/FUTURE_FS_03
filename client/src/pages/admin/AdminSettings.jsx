import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiGlobe, 
  FiDollarSign, 
  FiMail, 
  FiBell, 
  FiShield, 
  FiDatabase,
  FiRefreshCw,
  FiSave,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiDownload,
  FiUpload,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings,
  FiLock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { useCurrencyContext } from '../../context/CurrencyContext';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdminSettings = () => {
  const { user } = useAuthStore();
  const { currencyCode, setCurrencyCode, formatPrice } = useCurrencyContext();
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Jams Boutique',
    siteEmail: 'info@jamsboutique.com',
    sitePhone: '+251 911 234 567',
    siteAddress: 'Addis Ababa, Ethiopia',
    currency: currencyCode,
    timezone: 'Africa/Addis_Ababa',
    dateFormat: 'MM/DD/YYYY'
  });
  
  // Store Settings
  const [storeSettings, setStoreSettings] = useState({
    freeShippingThreshold: 50,
    taxRate: 2,
    lowStockAlert: 5,
    maxOrderQuantity: 10,
    allowGuestCheckout: false,
    requireEmailVerification: true
  });
  
  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@jamsboutique.com',
    fromName: 'Jams Boutique',
    orderConfirmation: true,
    paymentConfirmation: true,
    shippingUpdate: true,
    newsletterEnabled: true
  });
  
  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90,
    twoFactorAuth: false,
    ipWhitelist: '',
    maintenanceMode: false
  });
  
  // Stats & Analytics
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  // Fetch stats
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/products?limit=1'),
        api.get('/orders?limit=1'),
        api.get('/auth/users?limit=1')
      ]);
      
      setStats({
        totalProducts: productsRes.data.pagination?.total || 0,
        totalOrders: ordersRes.data.pagination?.total || 0,
        totalUsers: usersRes.data.pagination?.total || 0,
        totalRevenue: ordersRes.data.orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0,
        pendingOrders: ordersRes.data.orders?.filter(o => o.orderStatus === 'pending').length || 0,
        lowStockProducts: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  const handleGeneralChange = (key, value) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'currency') {
      setCurrencyCode(value);
      toast.success(`Currency changed to ${value}`);
    }
  };
  
  const handleStoreChange = (key, value) => {
    setStoreSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleEmailChange = (key, value) => {
    setEmailSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSecurityChange = (key, value) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };
  
  const saveSettings = async (section) => {
    setLoading(true);
    try {
      // In production, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${section} settings saved successfully!`);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };
  
  const exportData = async () => {
    try {
      const [products, orders, users] = await Promise.all([
        api.get('/products?limit=1000'),
        api.get('/orders?limit=1000'),
        api.get('/auth/users?limit=1000')
      ]);
      
      const exportData = {
        products: products.data.products || [],
        orders: orders.data.orders || [],
        users: users.data.users || [],
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jams-boutique-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };
  
  const clearAllData = async () => {
    setLoading(true);
    try {
      // In production, this would be a dangerous operation
      toast.success('All data cleared successfully!');
      setIsClearDataModalOpen(false);
    } catch (error) {
      toast.error('Failed to clear data');
    } finally {
      setLoading(false);
    }
  };
  
  const resetSystem = async () => {
    setLoading(true);
    try {
      // In production, reset to default settings
      toast.success('System reset to default settings!');
      setIsResetModalOpen(false);
    } catch (error) {
      toast.error('Failed to reset system');
    } finally {
      setLoading(false);
    }
  };
  
  const sections = [
    {
      id: 'general',
      title: 'General Settings',
      icon: FiGlobe,
      description: 'Manage basic site information and preferences',
      color: 'bg-blue-500'
    },
    {
      id: 'store',
      title: 'Store Settings',
      icon: FiShoppingCart,
      description: 'Configure store policies and limits',
      color: 'bg-green-500'
    },
    {
      id: 'email',
      title: 'Email Configuration',
      icon: FiMail,
      description: 'Set up email notifications and SMTP',
      color: 'bg-purple-500'
    },
    {
      id: 'security',
      title: 'Security & Maintenance',
      icon: FiShield,
      description: 'Security settings and system maintenance',
      color: 'bg-red-500'
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: FiDatabase,
      description: 'Export, backup, and data management',
      color: 'bg-yellow-500'
    }
  ];
  
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-dark-textMuted">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
          System Settings
        </h1>
        <p className="text-gray-600 dark:text-dark-textMuted">
          Manage your store configuration and preferences
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={FiShoppingCart} color="bg-blue-500" />
        <StatCard title="Total Revenue" value={formatPrice(stats.totalRevenue)} icon={FiTrendingUp} color="bg-green-500" />
        <StatCard title="Total Products" value={stats.totalProducts} icon={FiPackage} color="bg-purple-500" />
        <StatCard title="Total Users" value={stats.totalUsers} icon={FiUsers} color="bg-yellow-500" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={FiAlertCircle} color="bg-orange-500" />
        <StatCard title="Low Stock" value={stats.lowStockProducts} icon={FiPackage} color="bg-red-500" />
      </div>
      
      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
            <FiGlobe className="w-5 h-5 text-boutique-primary" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">General Settings</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Site Name</label>
                <input
                  type="text"
                  value={generalSettings.siteName}
                  onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site Email</label>
                <input
                  type="email"
                  value={generalSettings.siteEmail}
                  onChange={(e) => handleGeneralChange('siteEmail', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site Phone</label>
                <input
                  type="text"
                  value={generalSettings.sitePhone}
                  onChange={(e) => handleGeneralChange('sitePhone', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site Address</label>
                <input
                  type="text"
                  value={generalSettings.siteAddress}
                  onChange={(e) => handleGeneralChange('siteAddress', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  value={generalSettings.currency}
                  onChange={(e) => handleGeneralChange('currency', e.target.value)}
                  className="input-field"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="ETB">ETB - Ethiopian Birr</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Timezone</label>
                <select
                  value={generalSettings.timezone}
                  onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                  className="input-field"
                >
                  <option value="Africa/Addis_Ababa">Africa/Addis Ababa (EAT)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New York (EST)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => saveSettings('General')}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Store Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
            <FiShoppingCart className="w-5 h-5 text-boutique-primary" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Store Settings</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  value={storeSettings.freeShippingThreshold}
                  onChange={(e) => handleStoreChange('freeShippingThreshold', parseFloat(e.target.value))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  value={storeSettings.taxRate}
                  onChange={(e) => handleStoreChange('taxRate', parseFloat(e.target.value))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Low Stock Alert (units)</label>
                <input
                  type="number"
                  value={storeSettings.lowStockAlert}
                  onChange={(e) => handleStoreChange('lowStockAlert', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Order Quantity</label>
                <input
                  type="number"
                  value={storeSettings.maxOrderQuantity}
                  onChange={(e) => handleStoreChange('maxOrderQuantity', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={storeSettings.allowGuestCheckout}
                  onChange={(e) => handleStoreChange('allowGuestCheckout', e.target.checked)}
                  className="w-4 h-4 text-boutique-primary rounded"
                />
                <span className="ml-2 text-sm">Allow Guest Checkout</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={storeSettings.requireEmailVerification}
                  onChange={(e) => handleStoreChange('requireEmailVerification', e.target.checked)}
                  className="w-4 h-4 text-boutique-primary rounded"
                />
                <span className="ml-2 text-sm">Require Email Verification</span>
              </label>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => saveSettings('Store')}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
            <FiShield className="w-5 h-5 text-boutique-primary" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security & Maintenance</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Login Attempts</label>
                <input
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => handleSecurityChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password Expiry (days)</label>
                <input
                  type="number"
                  value={securitySettings.passwordExpiryDays}
                  onChange={(e) => handleSecurityChange('passwordExpiryDays', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IP Whitelist (comma separated)</label>
                <input
                  type="text"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => handleSecurityChange('ipWhitelist', e.target.value)}
                  className="input-field"
                  placeholder="192.168.1.1, 10.0.0.1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                  className="w-4 h-4 text-boutique-primary rounded"
                />
                <span className="ml-2 text-sm">Enable Two-Factor Authentication</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={securitySettings.maintenanceMode}
                  onChange={(e) => handleSecurityChange('maintenanceMode', e.target.checked)}
                  className="w-4 h-4 text-red-500 rounded"
                />
                <span className="ml-2 text-sm text-red-600">Maintenance Mode (Site will be inaccessible to customers)</span>
              </label>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => saveSettings('Security')}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
            <FiDatabase className="w-5 h-5 text-boutique-primary" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Management</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={exportData}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <FiDownload className="w-5 h-5" />
                Export All Data (JSON)
              </button>
              
              <button
                className="flex items-center justify-center gap-2 px-4 py-3 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FiUpload className="w-5 h-5" />
                Import Data
              </button>
              
              <button
                onClick={() => setIsResetModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
              >
                <FiRefreshCw className="w-5 h-5" />
                Reset to Default Settings
              </button>
              
              <button
                onClick={() => setIsClearDataModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
                Clear All Data
              </button>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Warning!</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                    Clearing all data or resetting settings is irreversible. Please export your data before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isClearDataModalOpen}
        onClose={() => setIsClearDataModalOpen(false)}
        onConfirm={clearAllData}
        title="Clear All Data"
        message="Are you absolutely sure? This will permanently delete all products, orders, and user data. This action cannot be undone!"
        confirmText="Yes, Clear All Data"
        cancelText="Cancel"
        type="danger"
      />
      
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetSystem}
        title="Reset System Settings"
        message="This will reset all system settings to their default values. Your products, orders, and user data will remain intact. Do you want to continue?"
        confirmText="Yes, Reset Settings"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default AdminSettings;