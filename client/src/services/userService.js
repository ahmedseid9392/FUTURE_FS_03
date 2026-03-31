import api from './api';

export const userService = {
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await api.get(`/auth/users?${params.toString()}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: {
            users: response.data.users || [],
            pagination: response.data.pagination || { page: 1, pages: 1, total: 0 }
          }
        };
      }
      
      return {
        success: false,
        data: { users: [], pagination: { page: 1, pages: 1, total: 0 } },
        message: response.data.message || 'Failed to fetch users'
      };
    } catch (error) {
      console.error('Get users error:', error);
      return {
        success: false,
        data: { users: [], pagination: { page: 1, pages: 1, total: 0 } },
        message: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/auth/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user'
      };
    }
  },
  
  updateRole: async (id, role) => {
    try {
      const response = await api.put(`/auth/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Update user role error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user role'
      };
    }
  },
  
  deactivate: async (id) => {
    try {
      const response = await api.put(`/auth/users/${id}/deactivate`);
      return response.data;
    } catch (error) {
      console.error('Deactivate user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to deactivate user'
      };
    }
  }
};