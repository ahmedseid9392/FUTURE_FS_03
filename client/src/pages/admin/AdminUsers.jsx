import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FiUsers, 
  FiMail, 
  FiPhone, 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiChevronDown,
  FiChevronUp,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
  FiCalendar,
  FiTrendingUp,
  FiShield,
  FiAward
} from 'react-icons/fi';
import { userService } from '../../services/userService';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    sortBy: '-createdAt',
    itemsPerPage: 20
  });
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', page, debouncedSearch, filters],
    queryFn: () => userService.getAll({ 
      page, 
      limit: filters.itemsPerPage, 
      search: debouncedSearch,
      role: filters.role,
      isActive: filters.isActive,
      sort: filters.sortBy
    }),
  });

  const users = data?.success ? (data.data?.users || data.users || []) : [];
  const pagination = data?.success ? (data.data?.pagination || data.pagination || { page: 1, pages: 1, total: 0 }) : { page: 1, pages: 1, total: 0 };

  const handleClearFilters = () => {
    setFilters({
      role: '',
      isActive: '',
      sortBy: '-createdAt',
      itemsPerPage: 20
    });
    setSearch('');
    setDebouncedSearch('');
    setPage(1);
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'customer', label: 'Customer' },
    { value: 'admin', label: 'Admin' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: '-name', label: 'Name Z-A' }
  ];

  // Calculate stats
  const totalUsers = pagination.total || 0;
  const activeUsers = users.filter(u => u.isActive !== false).length;
  const inactiveUsers = users.filter(u => u.isActive === false).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const customerUsers = users.filter(u => u.role === 'customer').length;
  const newThisMonth = users.filter(u => {
    const createdDate = new Date(u.createdAt);
    const now = new Date();
    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
  }).length;

  const activeFiltersCount = [
    filters.role, 
    filters.isActive,
    search,
    filters.sortBy !== '-createdAt'
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
          User Management
        </h1>
        <p className="text-gray-600 dark:text-dark-textMuted">
          Manage customer and admin accounts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Users</p>
              <p className="text-xl font-bold">{totalUsers}</p>
            </div>
            <FiUsers className="w-6 h-6 text-boutique-primary opacity-50" />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Active</p>
              <p className="text-xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <FiUserCheck className="w-6 h-6 text-green-500 opacity-50" />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Inactive</p>
              <p className="text-xl font-bold text-red-600">{inactiveUsers}</p>
            </div>
            <FiUserX className="w-6 h-6 text-red-500 opacity-50" />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Admins</p>
              <p className="text-xl font-bold text-purple-600">{adminUsers}</p>
            </div>
            <FiShield className="w-6 h-6 text-purple-500 opacity-50" />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Customers</p>
              <p className="text-xl font-bold text-blue-600">{customerUsers}</p>
            </div>
            <FiUsers className="w-6 h-6 text-blue-500 opacity-50" />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">New This Month</p>
              <p className="text-xl font-bold text-teal-600">{newThisMonth}</p>
            </div>
            <FiUserPlus className="w-6 h-6 text-teal-500 opacity-50" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-dark-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-boutique-primary text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              {showFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Role Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      User Role
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                      className="input-field"
                    >
                      {roleOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Account Status
                    </label>
                    <select
                      value={filters.isActive}
                      onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                      className="input-field"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
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
                      value={filters.itemsPerPage}
                      onChange={(e) => setFilters(prev => ({ ...prev, itemsPerPage: Number(e.target.value) }))}
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
                      {filters.role && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          Role: {filters.role}
                          <button onClick={() => setFilters(prev => ({ ...prev, role: '' }))} className="hover:text-red-500">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          Status: {filters.isActive === 'active' ? 'Active' : 'Inactive'}
                          <button onClick={() => setFilters(prev => ({ ...prev, isActive: '' }))} className="hover:text-red-500">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {search && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          Search: {search}
                          <button onClick={() => setSearch('')} className="hover:text-red-500">
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
          Showing {users.length} of {pagination.total} users
        </p>
      </div>

      {/* Users Grid/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-md transition-all duration-300"
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                  user.role === 'admin' 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-700' 
                    : 'bg-gradient-to-br from-boutique-primary to-boutique-accent'
                }`}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          user.isActive !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-textMuted">
                      <FiMail className="w-3 h-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-textMuted">
                        <FiPhone className="w-3 h-3" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Address (if exists) */}
                  {user.address?.street && (
                    <div className="mt-2 text-xs text-gray-400 truncate">
                      📍 {user.address.street}, {user.address.city}
                    </div>
                  )}
                  
                  {/* Last Login (if exists) */}
                  {user.lastLogin && (
                    <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                      <FiTrendingUp className="w-3 h-3" />
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-dark-border flex justify-end gap-2">
                <button
                  onClick={() => {
                    // View user details
                    toast.success(`Viewing ${user.name}'s profile`);
                  }}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View Details
                </button>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => {
                      // Toggle user status
                      toast.success(`User ${user.isActive !== false ? 'deactivated' : 'activated'}`);
                    }}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      user.isActive !== false
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {user.isActive !== false ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
          <FiUsers className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-dark-text mb-2">
            No users found
          </h3>
          <p className="text-gray-500">No users match your search criteria</p>
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
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
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
                      : 'hover:bg-gray-100'
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
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;