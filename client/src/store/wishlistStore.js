import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to wishlist
      addItem: (product) => {
        const exists = get().items.some(item => item._id === product._id);
        if (!exists) {
          set({ items: [...get().items, product] });
          return true;
        }
        return false;
      },
      
      // Remove item from wishlist
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item._id !== productId) });
      },
      
      // Check if item is in wishlist
      isInWishlist: (productId) => {
        return get().items.some(item => item._id === productId);
      },
      
      // Clear entire wishlist
      clearWishlist: () => set({ items: [] }),
      
      // Get total items count
      getTotalItems: () => get().items.length,
      
      // Move item from wishlist to cart
      moveToCart: (product, addToCart) => {
        addToCart(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
        get().removeItem(product._id);
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
);