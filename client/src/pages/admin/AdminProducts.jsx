import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch,
  FiPackage,
  FiAlertCircle,
  FiEye,
  FiStar,
  FiTrendingUp,
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiTag,
  FiGrid
} from 'react-icons/fi';
import { productService } from '../../services/productService';
import { useCurrencyContext } from '../../context/CurrencyContext';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ProductFormModal from '../../components/admin/ProductFormModal';
import ProductDetailModal from '../../components/admin/ProductDetailModal';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProducts = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    stockStatus: '',
    sortBy: '-createdAt',
    itemsPerPage: 20
  });
  
  const queryClient = useQueryClient();
  const { formatPrice } = useCurrencyContext();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, debouncedSearch, filters],
    queryFn: () => productService.getAll({ 
      page, 
      limit: filters.itemsPerPage, 
      search: debouncedSearch,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sortBy
    }),
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const products = data?.success ? (data.data?.products || data.products || []) : [];
  const pagination = data?.success ? (data.data?.pagination || data.pagination || { page: 1, pages: 1, total: 0 }) : { page: 1, pages: 1, total: 0 };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete._id);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries(['admin-products']);
    setIsFormModalOpen(false);
    setSelectedProduct(null);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      stockStatus: '',
      sortBy: '-createdAt',
      itemsPerPage: 20
    });
    setSearch('');
    setDebouncedSearch('');
    setPage(1);
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'gifts', label: 'Gifts' },
    { value: 'new-arrivals', label: 'New Arrivals' },
    { value: 'sale', label: 'Sale' }
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: '-averageRating', label: 'Best Rating' }
  ];

  const stockStatusOptions = [
    { value: '', label: 'All Stock' },
    { value: 'in_stock', label: 'In Stock (>10)' },
    { value: 'low_stock', label: 'Low Stock (1-10)' },
    { value: 'out_of_stock', label: 'Out of Stock (0)' }
  ];

  // Calculate stats
  const totalProducts = pagination.total || 0;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const avgRating = products.reduce((acc, p) => acc + (p.averageRating || 0), 0) / (products.length || 1);
  const activeFiltersCount = [
    filters.category, 
    filters.minPrice, 
    filters.maxPrice, 
    filters.stockStatus,
    search,
    filters.sortBy !== '-createdAt'
  ].filter(Boolean).length;

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Out of Stock</span>;
    }
    if (stock <= 10) {
      return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">Low Stock ({stock})</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">In Stock ({stock})</span>;
  };

  const getRatingBadge = (rating) => {
    if (!rating || rating === 0) {
      return <span className="text-gray-400">No ratings</span>;
    }
    return (
      <div className="flex items-center gap-1">
        <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
            Products
          </h1>
          <p className="text-gray-600 dark:text-dark-textMuted">
            Manage your product catalog
          </p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <FiPlus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <FiPackage className="w-8 h-8 text-boutique-primary opacity-50" />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-bold text-orange-600">{lowStockProducts}</p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-orange-500 opacity-50" />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Rating</p>
              <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-green-500 opacity-50" />
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
                placeholder="Search products by name, description, or tags..."
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
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                      className="input-field"
                    >
                      {categoryOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range - Min */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Min Price (USD)
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                        className="input-field pl-8"
                      />
                    </div>
                  </div>

                  {/* Price Range - Max */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Max Price (USD)
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        placeholder="1000"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        className="input-field pl-8"
                      />
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Stock Status
                    </label>
                    <select
                      value={filters.stockStatus}
                      onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                      className="input-field"
                    >
                      {stockStatusOptions.map(opt => (
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
                      {filters.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          Category: {filters.category}
                          <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))} className="hover:text-red-500">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {(filters.minPrice || filters.maxPrice) && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          Price: {filters.minPrice || '0'} - {filters.maxPrice || '∞'}
                          <button onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))} className="hover:text-red-500">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.stockStatus && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-boutique-primary/10 text-boutique-primary text-xs rounded-full">
                          Stock: {stockStatusOptions.find(o => o.value === filters.stockStatus)?.label}
                          <button onClick={() => setFilters(prev => ({ ...prev, stockStatus: '' }))} className="hover:text-red-500">
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
          Showing {products.length} of {pagination.total} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-md transition-all duration-300"
          >
            <div className="p-4">
              <div className="flex flex-wrap gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/80'}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 capitalize flex items-center gap-1">
                          <FiTag className="w-3 h-3" />
                          {product.category}
                        </span>
                        <span className="text-sm text-gray-400">SKU: {product._id?.slice(-8)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-boutique-primary">
                        {formatPrice(product.price)}
                      </p>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <p className="text-sm text-gray-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    {getStockBadge(product.stock)}
                    <div className="flex items-center gap-1">
                      {getRatingBadge(product.averageRating)}
                      {product.totalReviews > 0 && (
                        <span className="text-xs text-gray-400">({product.totalReviews} reviews)</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleViewDetails(product)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Product"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
          <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-dark-text mb-2">
            No products found
          </h3>
          <p className="text-gray-500">No products match your search criteria</p>
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

      {/* Modals */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
};

export default AdminProducts;