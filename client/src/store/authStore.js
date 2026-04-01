import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      },
      
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      },
      
      login: async (credentials) => {
        set({ loading: true });
        try {
          const result = await authService.login(credentials);
          if (result.success) {
            set({ 
              user: result.data.user, 
              token: result.data.token,
              isAuthenticated: true,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ loading: false });
            return { success: false, message: result.message };
          }
        } catch (error) {
          set({ loading: false });
          return { success: false, message: error.message };
        }
      },
      
      register: async (userData) => {
        set({ loading: true });
        try {
          const result = await authService.register(userData);
          if (result.success) {
            set({ 
              user: result.data.user, 
              token: result.data.token,
              isAuthenticated: true,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ loading: false });
            return { success: false, message: result.message, errors: result.errors };
          }
        } catch (error) {
          set({ loading: false });
          return { success: false, message: error.message };
        }
      },
      
      logout: () => {
        authService.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      checkAuth: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ 
              token, 
              user, 
              isAuthenticated: true 
            });
          } catch (error) {
            console.error('Error parsing user:', error);
            set({ user: null, token: null, isAuthenticated: false });
          }
        } else {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        set({ user: updatedUser });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);