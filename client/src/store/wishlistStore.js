import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const currentItems = get().items;
        const exists = currentItems.some(item => item._id === product._id);
        
        if (!exists) {
          set({ items: [...currentItems, product] });
          return true;
        }
        return false;
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item._id !== productId) });
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item._id === productId);
      },
      
      clearWishlist: () => set({ items: [] }),
      
      getTotalItems: () => get().items.length
    }),
    {
      name: 'wishlist-storage',
    }
  )
);