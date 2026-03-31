import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1, size = '', color = '') => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          item => item._id === product._id && item.size === size && item.color === color
        );
        
        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item._id === product._id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
            items: [...currentItems, {
              ...product,
              quantity,
              selectedSize: size,
              selectedColor: color
            }]
          });
        }
      },
      
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            item => !(item._id === productId && item.selectedSize === size && item.selectedColor === color)
          )
        });
      },
      
      updateQuantity: (productId, quantity, size, color) => {
        if (quantity < 1) {
          get().removeItem(productId, size, color);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item._id === productId && item.selectedSize === size && item.selectedColor === color
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 50 ? 0 : 5;
      },
      
      getTax: () => {
        return get().getSubtotal() * 0.02;
      },
      
      getTotal: () => {
        return get().getSubtotal() + get().getShipping() + get().getTax();
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);