import api from './api';

export const searchService = {
  // Search products with filters
  searchProducts: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      console.log('🔍 Searching with params:', params.toString());
      
      const response = await api.get(`/products?${params.toString()}`);
      
      console.log('📦 Search response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        data: { products: [], pagination: { page: 1, pages: 1, total: 0 } },
        message: error.response?.data?.message || 'Search failed'
      };
    }
  },
  
  // Get search suggestions (autocomplete)
  getSuggestions: async (query) => {
    try {
      if (!query || query.length < 2) {
        return { success: true, data: { suggestions: [] } };
      }
      
      const response = await api.get(`/products/search/suggestions?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Suggestions error:', error);
      return { success: false, data: { suggestions: [] } };
    }
  },
  
  // Get popular searches
  getPopularSearches: async () => {
    try {
      const response = await api.get('/products?limit=10');
      if (response.data.success && response.data.products) {
        const popularNames = response.data.products.map(p => p.name).slice(0, 10);
        return { success: true, data: { searches: popularNames } };
      }
      return { success: false, data: { searches: [] } };
    } catch (error) {
      console.error('Popular searches error:', error);
      return { 
        success: false, 
        data: { searches: ['dresses', 'jewelry', 'accessories', 'gifts', 'new arrivals'] } 
      };
    }
  },
  
  // Save search query (for analytics)
  saveSearchQuery: async (query) => {
    try {
      await api.post('/analytics/search', { query });
    } catch (error) {
      console.error('Save search error:', error);
    }
  }
};