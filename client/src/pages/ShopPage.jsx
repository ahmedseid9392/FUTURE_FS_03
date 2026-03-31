import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiX, FiDollarSign } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import ProductGrid from '../components/products/ProductGrid';
import { productService } from '../services/productService';
import { useCurrencyContext } from '../context/CurrencyContext';
import CurrencyToggle from '../components/common/CurrencyToggle';

const ShopPage = () => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: '-createdAt',
    page: 1
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const { currencyCode, formatPrice, convertPrice } = useCurrencyContext();
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await productService.getCategories();
      if (result.success) {
        setCategories(result.data.categories);
      }
    };
    fetchCategories();
  }, []);
  
  // Fetch products
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
    enabled: true
  });
  
  const products = data?.success ? data.data.products : [];
  const pagination = data?.success ? data.data.pagination : null;
  
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
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the filter change
    refetch();
  };
  
  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Currency Toggle */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-playfair font-bold text-boutique-secondary dark:text-boutique-primary mb-2">
            Shop Our Collection
          </h1>
          <p className="text-gray-600 dark:text-dark-textMuted">
            Discover unique fashion pieces that tell your story
          </p>
        </div>
        <CurrencyToggle />
      </div>
      
      {/* Search and Sort Bar */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name, description, or tags..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input-field pl-10"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <FiX className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center gap-2"
          >
            <FiFilter />
            Filters
          </button>
          
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="input-field w-40"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button type="submit" className="btn-primary">
            Search
          </button>
        </div>
      </form>
      
      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-4 bg-gray-50 dark:bg-dark-card rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} ({cat.count})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Min Price ({currencyCode})</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Max Price ({currencyCode})</label>
              <input
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Note: Prices are in {currencyCode}. All products are priced in USD and converted at current rates.
            </p>
            <button onClick={clearFilters} className="text-boutique-primary hover:underline">
              Clear All Filters
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600 dark:text-dark-textMuted">
          Found {pagination?.total || 0} products
          {filters.search && ` for "${filters.search}"`}
          {pagination && ` (Page ${pagination.page} of ${pagination.pages})`}
        </p>
      </div>
      
      {/* Product Grid */}
      <ProductGrid products={products} loading={isLoading} columns={4} />
      
      {/* No Results Message */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-12">
          <FiSearch className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-dark-text mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-dark-textMuted">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 btn-outline"
          >
            Clear all filters
          </button>
        </div>
      )}
      
      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => handleFilterChange('page', filters.page - 1)}
            disabled={filters.page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-dark-card"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {filters.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handleFilterChange('page', filters.page + 1)}
            disabled={filters.page === pagination.pages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-dark-card"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopPage;