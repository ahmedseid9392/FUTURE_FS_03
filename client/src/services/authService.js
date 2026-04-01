import api from './api';

export const authService = {
  register: async (userData) => {
    try {
      console.log('📤 Sending registration data:', userData);
      
      const response = await api.post('/auth/register', userData);
      
      console.log('✅ Registration response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Registration error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors,
        status: error.response?.status
      };
    }
  },
  
  login: async (credentials) => {
    try {
      console.log('📤 Sending login data:', { email: credentials.email });
      
      const response = await api.post('/auth/login', credentials);
      
      console.log('✅ Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Login error details:', {
        status: error.response?.status,
        data: error.response?.data
      });
      
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
  
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      };
    }
  },
  
 updateProfile: async (userData) => {
  try {
    console.log('📤 Updating profile with data:', userData);
    
    // Make sure we're sending the correct data structure
    const updateData = {};
    if (userData.name) updateData.name = userData.name;
    if (userData.phone) updateData.phone = userData.phone;
    if (userData.address) updateData.address = userData.address;
    if (userData.profileImage !== undefined) {
      updateData.profileImage = {
        url: userData.profileImage?.url || '',
        publicId: userData.profileImage?.publicId || ''
      };
    }
    
    const response = await api.put('/auth/profile', updateData);
    
    console.log('📥 Update profile response:', response.data);
    
    if (response.data.user) {
      // Update localStorage with new user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('✅ User updated in localStorage:', updatedUser);
    }
    
    return {
      success: true,
      user: response.data.user
    };
  } catch (error) {
    console.error('❌ Update profile error:', error);
    console.error('Error response:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile'
    };
  }
},
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password'
      };
    }
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};