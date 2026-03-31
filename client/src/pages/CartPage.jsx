import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft, FiLock } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import { useCurrencyContext } from '../context/CurrencyContext';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getShipping, getTax, getTotal } = useCartStore();
  const { formatPrice } = useCurrencyContext();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your cart');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null; // Will redirect
  }
  
  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(item._id, item.selectedSize, item.selectedColor);
      toast.success(`${item.name} removed from cart`);
    } else if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available`);
    } else {
      updateQuantity(item._id, newQuantity, item.selectedSize, item.selectedColor);
    }
  };
  
  const handleRemoveItem = (item) => {
    removeItem(item._id, item.selectedSize, item.selectedColor);
    toast.success(`${item.name} removed from cart`);
  };
  
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <FiShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-600 dark:text-dark-textMuted mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link to="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }
  
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-8">
        Shopping Cart ({items.length} items)
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 p-4 bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border"
            >
              {/* Product Image */}
              <img
                src={item.images?.[0]?.url || 'https://via.placeholder.com/100'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              
              {/* Product Info */}
              <div className="flex-1">
                <Link to={`/product/${item._id}`} className="font-semibold text-gray-800 dark:text-white hover:text-boutique-primary">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-dark-textMuted">
                  {item.selectedSize && `Size: ${item.selectedSize}`}
                  {item.selectedSize && item.selectedColor && ' | '}
                  {item.selectedColor && `Color: ${item.selectedColor}`}
                </p>
                <p className="text-sm text-gray-500">Price: {formatPrice(item.price)}</p>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                    className="p-1 border rounded-md hover:bg-gray-100"
                  >
                    <FiMinus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                    className="p-1 border rounded-md hover:bg-gray-100"
                  >
                    <FiPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* Price & Remove */}
              <div className="text-right">
                <p className="font-semibold text-boutique-primary">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
          
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <FiTrash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-textMuted">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-textMuted">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-textMuted">Tax (2%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-dark-border pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-boutique-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full mt-6 py-3"
            >
              Proceed to Checkout
            </button>
            
            <Link to="/shop" className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 hover:text-boutique-primary">
              <FiArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;