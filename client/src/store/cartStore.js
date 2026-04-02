import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
     addItem: (product, quantity = 1, size = '', color = '') => {
  const currentItems = get().items;
  
  // Check if item already exists with same variant
  const existingItem = currentItems.find(
    item => item._id === product._id && item.selectedSize === size && item.selectedColor === color
  );
  
  if (existingItem) {
    // Update quantity if already exists
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      toast.error(`Cannot add more than ${product.stock} items`);
      return;
    }
    set({
      items: currentItems.map(item =>
        item._id === product._id && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    });
  } else {
    // Add new item
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