import api from './api';

export const productService = {
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);
      if (filters.featured) params.append('featured', filters.featured);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await api.get(`/products?${params.toString()}`);
      
      // Handle different response structures
      if (response.data.success) {
        return {
          success: true,
          data: {
            products: response.data.products || [],
            pagination: response.data.pagination || { page: 1, pages: 1, total: 0 }
          }
        };
      }
      
      // If response doesn't have success field but has products directly
      if (response.data.products) {
        return {
          success: true,
          data: {
            products: response.data.products || [],
            pagination: response.data.pagination || { page: 1, pages: 1, total: response.data.products?.length || 0 }
          }
        };
      }
      
      return {
        success: false,
        data: { products: [], pagination: { page: 1, pages: 1, total: 0 } },
        message: response.data.message || 'Failed to fetch products'
      };
    } catch (error) {
      console.error('Get products error:', error);
      return { 
        success: false, 
        data: { products: [], pagination: { page: 1, pages: 1, total: 0 } },
        message: error.response?.data?.message || 'Failed to fetch products' 
      };
    }
  },
  
  getCategories: async () => {
    try {
      const response = await api.get('/products/categories/all');
      
      // Handle response structure
      if (response.data.success) {
        return {
          success: true,
          data: {
            categories: response.data.categories || []
          }
        };
      }
      
      // If response has categories directly
      if (response.data.categories) {
        return {
          success: true,
          data: {
            categories: response.data.categories
          }
        };
      }
      
      return {
        success: false,
        data: { categories: [] },
        message: response.data.message || 'Failed to fetch categories'
      };
    } catch (error) {
      console.error('Get categories error:', error);
      return { 
        success: false, 
        data: { categories: [] },
        message: error.response?.data?.message || 'Failed to fetch categories' 
      };
    }
  },
  
  getById: async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    console.log('Product API Response:', response.data);
    
    // Handle different response structures
    if (response.data.success) {
      return {
        success: true,
        data: response.data
      };
    }
    
    // If response already has the product directly
    if (response.data.product) {
      return {
        success: true,
        data: { product: response.data.product }
      };
    }
    
    return { 
      success: false, 
      message: response.data?.message || 'Product not found' 
    };
  } catch (error) {
    console.error('Get product error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Product not found' 
    };
  }
},
  
  getFeatured: async (limit = 8) => {
    try {
      const response = await api.get(`/products/featured?limit=${limit}`);
      if (response.data.success) {
        return { success: true, data: { products: response.data.products || [] } };
      }
      return { success: false, data: { products: [] } };
    } catch (error) {
      console.error('Get featured products error:', error);
      return { success: false, data: { products: [] } };
    }
  },
  
  getByCategory: async (category, limit = 20) => {
    try {
      const response = await api.get(`/products/category/${category}?limit=${limit}`);
      if (response.data.success) {
        return { success: true, data: { products: response.data.products || [] } };
      }
      return { success: false, data: { products: [] } };
    } catch (error) {
      console.error('Get by category error:', error);
      return { success: false, data: { products: [] } };
    }
  },
  
 addReview: async (productId, reviewData) => {
  try {
    console.log('Sending review data:', { productId, reviewData });
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    console.log('Review response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Add review error:', error);
    console.error('Error response:', error.response?.data);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to add review' 
    };
  }
},
  
  create: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create product'
      };
    }
  },
  
  update: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update product'
      };
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete product error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete product'
      };
    }
  }
};