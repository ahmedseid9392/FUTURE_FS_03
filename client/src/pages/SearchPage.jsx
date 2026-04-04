import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiArrowLeft, FiSearch, FiPackage } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import ProductGrid from '../components/products/ProductGrid';
import { searchService } from '../services/searchService';
import { useCurrencyContext } from '../context/CurrencyContext';
import SearchAutocomplete from '../components/search/SearchAutocomplete';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
    page: 1
  });
  const [showFilters, setShowFilters] = useState(false);
  const { formatPrice } = useCurrencyContext();

  // Fetch search results
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => searchService.searchProducts(query, filters),
    enabled: !!query
  });

  // FIXED: Properly extract products from response
  const products = data?.products || data?.data?.products || [];
  const pagination = data?.pagination || data?.data?.pagination || { page: 1, pages: 1, total: 0 };

  console.log('Search data:', data);
  console.log('Extracted products:', products);
  console.log('Products count:', products.length);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setSearchParams({ q: searchQuery });
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt',
      page: 1
    });
  };

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  const categories = [
    { value: 'dresses', label: 'Dresses' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'gifts', label: 'Gifts' },
    { value: 'new-arrivals', label: 'New Arrivals' },
    { value: 'sale', label: 'Sale' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-gray-600 hover:text-boutique-primary mb-4">
          <FiArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
        
        <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
          Search Results
        </h1>
        
        {/* Search Bar */}
        <SearchAutocomplete onSearch={handleSearch} placeholder="Search products..." />
      </div>

      {query && (
        <>
          {/* Results Header */}
          <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-gray-600 dark:text-dark-textMuted">
                Found <span className="font-semibold text-boutique-primary">{pagination.total || products.length}</span> results for 
                <span className="font-semibold text-gray-900 dark:text-white"> "{query}"</span>
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
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
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 bg-gray-50 dark:bg-dark-card rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button onClick={clearFilters} className="text-boutique-primary hover:underline">
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}

          {/* Product Grid */}
          <ProductGrid products={products} loading={isLoading} columns={4} />

          {/* No Results */}
          {!isLoading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPackage className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-dark-text mb-2">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-dark-textMuted mb-6">
                Try different keywords or browse our categories
              </p>
              <Link to="/shop" className="btn-primary">
                Browse All Products
              </Link>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => handleFilterChange('page', filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {filters.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handleFilterChange('page', filters.page + 1)}
                disabled={filters.page === pagination.pages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {!query && (
        <div className="text-center py-12">
          <FiSearch className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
            Search for Products
          </h2>
          <p className="text-gray-600 dark:text-dark-textMuted">
            Enter keywords above to find your favorite products
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;