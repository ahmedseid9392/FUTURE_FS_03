import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFilter, 
  FiSearch, 
  FiX, 
  FiDollarSign, 
  FiGrid, 
  FiList,
  FiChevronDown,
  FiChevronUp,
  FiSliders,
  FiTag,
  FiStar,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import { productService } from '../services/productService';
import { useCurrencyContext } from '../context/CurrencyContext';
import CurrencyToggle from '../components/common/CurrencyToggle';
import SearchAutocomplete from '../components/search/SearchAutocomplete';
import RecommendationSection from '../components/recommendations/RecommendationSection';
const ShopPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: '-createdAt',
    page: 1
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const { currencyCode, formatPrice } = useCurrencyContext();
  
  // Get search param from URL on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setFilters(prev => ({ ...prev, search: searchParam, page: 1 }));
    }
  }, [location.search]);
  
  // Handle search from autocomplete
  const handleSearch = (searchQuery) => {
    setFilters(prev => ({ ...prev, search: searchQuery || '', page: 1 }));
    if (searchQuery) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/shop');
    }
  };
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const result = await productService.getCategories();
        if (result.success && result.data && result.data.categories) {
          setCategories(result.data.categories);
        } else if (result.categories) {
          setCategories(result.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);
  
  // Count active filters (excluding search for display purposes)
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    setActiveFiltersCount(count);
  }, [filters]);
  
  // Fetch products
  const { data: productsResult, isLoading: productsLoading, refetch } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
    enabled: true
  });
  
  const products = productsResult?.success ? (productsResult.data?.products || productsResult.products || []) : [];
  const pagination = productsResult?.success ? (productsResult.data?.pagination || productsResult.pagination || { page: 1, pages: 1, total: 0 }) : { page: 1, pages: 1, total: 0 };
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };
  
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: '-createdAt',
      page: 1
    });
    navigate('/shop');
  };
  
  const clearSearch = () => {
    setFilters(prev => ({ ...prev, search: '', page: 1 }));
    navigate('/shop');
  };
  
  const sortOptions = [
    { value: '-createdAt', label: 'Newest First', icon: FiZap },
    { value: 'price', label: 'Price: Low to High', icon: FiTrendingUp },
    { value: '-price', label: 'Price: High to Low', icon: FiTrendingUp },
    { value: 'name', label: 'Name: A to Z', icon: FiTag },
    { value: '-rating', label: 'Best Rating', icon: FiStar }
  ];
  
  const isLoading = productsLoading || categoriesLoading;
  
  // Price range presets
  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: null }
  ];
  
  const applyPriceRange = (range) => {
    setFilters(prev => ({
      ...prev,
      minPrice: range.min.toString(),
      maxPrice: range.max ? range.max.toString() : '',
      page: 1
    }));
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-boutique-primary to-boutique-accent bg-clip-text text-transparent mb-4">
            Shop Our Collection
          </h1>
          <p className="text-gray-600 dark:text-dark-textMuted max-w-2xl mx-auto">
            Discover unique fashion pieces that tell your story. Each item is carefully curated for quality and style.
          </p>
        </motion.div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-dark-card/80 backdrop-blur-lg rounded-xl shadow-sm mb-8 p-4 border border-gray-200 dark:border-dark-border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Autocomplete */}
          <div className="flex-1">
            <SearchAutocomplete 
              onSearch={handleSearch} 
              placeholder="Search products by name, description, or tags..."
              initialValue={filters.search}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-outline flex items-center gap-2 relative ${showFilters ? 'border-boutique-primary text-boutique-primary' : ''}`}
            >
              <FiSliders className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-boutique-primary text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <FiChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Sort Select */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input-field pr-10 appearance-none cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 dark:border-dark-border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-boutique-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-dark-card'}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-boutique-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-dark-card'}`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
            
            {/* Currency Toggle */}
            <CurrencyToggle />
          </div>
        </div>
        
        {/* Active Search Display with Clear Button */}
        {filters.search && (
          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Search results for:</span>
              <span className="text-sm font-semibold text-boutique-primary">"{filters.search}"</span>
            </div>
            <button
              onClick={clearSearch}
              className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
            >
              <FiX className="w-4 h-4" />
              Clear Search
            </button>
          </div>
        )}
      </div>
      
      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-dark-border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-sm text-boutique-primary hover:underline">
                    Clear all ({activeFiltersCount})
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.name || cat} value={cat.name || cat}>
                        {typeof cat === 'object' ? (cat.name?.charAt(0).toUpperCase() + cat.name?.slice(1)) : (cat?.charAt(0).toUpperCase() + cat?.slice(1))} 
                        {cat.count ? ` (${cat.count})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Price Range Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                    Price Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyPriceRange(range)}
                        className="px-3 py-1 text-xs border rounded-full hover:border-boutique-primary hover:text-boutique-primary transition-colors"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Custom Price Range */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                    Custom Price Range ({currencyCode})
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="input-field pl-8"
                      />
                    </div>
                    <span className="text-gray-400 self-center">-</span>
                    <div className="flex-1 relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="input-field pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-border">
                  <p className="text-sm text-gray-600 dark:text-dark-textMuted mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.category && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-boutique-primary/10 text-boutique-primary text-sm rounded-full">
                        Category: {filters.category}
                        <button onClick={() => handleFilterChange('category', '')} className="hover:text-red-500">
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-boutique-primary/10 text-boutique-primary text-sm rounded-full">
                        Price: {filters.minPrice || '0'} - {filters.maxPrice || '∞'} {currencyCode}
                        <button onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }} className="hover:text-red-500">
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Results Header */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-gray-600 dark:text-dark-textMuted">
            Showing <span className="font-semibold text-boutique-primary">{products.length}</span> of{' '}
            <span className="font-semibold">{pagination?.total || 0}</span> products
            {filters.search && ` matching "${filters.search}"`}
          </p>
        </div>
        
        {pagination && pagination.pages > 1 && (
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </p>
        )}
      </div>
      
      {/* Product Grid/List */}
      <ProductGrid products={products} loading={isLoading} columns={viewMode === 'grid' ? 4 : 1} />
      
      {/* No Results Message */}
      {!isLoading && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
            <FiSearch className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-playfair font-bold text-gray-800 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-dark-textMuted mb-6 max-w-md mx-auto">
            {filters.search 
              ? `We couldn't find any products matching "${filters.search}". Try different keywords or browse our categories.`
              : "We couldn't find any products matching your criteria. Try adjusting your search or filter settings."}
          </p>
          {filters.search && (
            <button onClick={clearSearch} className="btn-primary inline-flex items-center gap-2 mb-3">
              <FiX className="w-4 h-4" />
              Clear Search
            </button>
          )}
          {(filters.category || filters.minPrice || filters.maxPrice) && (
            <button onClick={clearFilters} className="btn-outline inline-flex items-center gap-2">
              <FiX className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </motion.div>
      )}
      
      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleFilterChange('page', filters.page - 1)}
              disabled={filters.page === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            >
              Previous
            </button>
            
            {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (filters.page <= 3) {
                pageNum = i + 1;
              } else if (filters.page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = filters.page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handleFilterChange('page', pageNum)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filters.page === pageNum
                      ? 'bg-boutique-primary text-white'
                      : 'border hover:bg-gray-100 dark:hover:bg-dark-card'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handleFilterChange('page', filters.page + 1)}
              disabled={filters.page === pagination.pages}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;