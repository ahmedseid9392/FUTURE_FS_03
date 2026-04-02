import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiTrash2, 
  FiPlus, 
  FiMinus, 
  FiShoppingBag, 
  FiArrowLeft, 
  FiLock,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiHeart
} from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import { useCurrencyContext } from '../context/CurrencyContext';
import { useAuthStore } from '../store/authStore';
import ConfirmationModal from '../components/common/ConfirmationModal';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getSubtotal, 
    getShipping, 
    getTax, 
    getTotal,
    getTotalItems
  } = useCartStore();
  const { formatPrice } = useCurrencyContext();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your cart');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(item._id, item.selectedSize, item.selectedColor);
      toast.success(`${item.name} removed from cart`);
    } else if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available for ${item.name}`);
    } else {
      updateQuantity(item._id, newQuantity, item.selectedSize, item.selectedColor);
    }
  };
  
  const handleRemoveItem = (item) => {
    removeItem(item._id, item.selectedSize, item.selectedColor);
    toast.success(`${item.name} removed from cart`);
  };
  
  const handleClearCart = () => {
    clearCart();
    setIsClearCartModalOpen(false);
    toast.success('Cart cleared successfully');
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-gray-800 dark:text-white mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-dark-textMuted mb-8">
            Looks like you haven't added any items to your cart yet. 
            Start shopping to discover amazing products!
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingBag className="w-4 h-4" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();
  const totalItems = getTotalItems();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Clear Cart Confirmation Modal */}
      <ConfirmationModal
        isOpen={isClearCartModalOpen}
        onClose={() => setIsClearCartModalOpen(false)}
        onConfirm={handleClearCart}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmText="Yes, Clear Cart"
        cancelText="Cancel"
        type="danger"
      />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
          Shopping Cart
        </h1>
        <p className="text-gray-600 dark:text-dark-textMuted">
          You have {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 p-4 bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <Link to={`/product/${item._id}`} className="flex-shrink-0">
                <img
                  src={item.images?.[0]?.url || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
              </Link>
              
              {/* Product Info */}
              <div className="flex-1">
                <Link 
                  to={`/product/${item._id}`} 
                  className="font-semibold text-gray-800 dark:text-white hover:text-boutique-primary transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                
                <div className="mt-1 space-y-1">
                  {item.selectedSize && (
                    <p className="text-sm text-gray-500 dark:text-dark-textMuted">
                      Size: <span className="font-medium">{item.selectedSize}</span>
                    </p>
                  )}
                  {item.selectedColor && (
                    <p className="text-sm text-gray-500 dark:text-dark-textMuted">
                      Color: <span className="font-medium">{item.selectedColor}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-dark-textMuted">
                    Price: {formatPrice(item.price)}
                  </p>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                    className="p-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                    className="p-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                    aria-label="Increase quantity"
                  >
                    <FiPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* Price & Remove */}
              <div className="text-right">
                <p className="font-semibold text-boutique-primary text-lg">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="text-red-500 hover:text-red-700 mt-2 transition-colors"
                  aria-label="Remove item"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Link 
              to="/shop" 
              className="flex items-center gap-2 text-gray-600 hover:text-boutique-primary transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            
            <button
              onClick={() => setIsClearCartModalOpen(true)}
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-textMuted">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-textMuted">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
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
            
            {/* Shipping Info */}
            <div className="mt-6 space-y-2 text-sm text-gray-500 dark:text-dark-textMuted">
              <div className="flex items-center gap-2">
                <FiTruck className="w-4 h-4" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <FiRefreshCw className="w-4 h-4" />
                <span>30-day easy returns</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4" />
                <span>Secure checkout guaranteed</span>
              </div>
            </div>
            
            {/* Checkout Button */}
            <Link
              to="/checkout"
              className="btn-primary w-full mt-6 py-3 text-center flex items-center justify-center gap-2"
            >
              <FiLock className="w-4 h-4" />
              Proceed to Checkout
            </Link>
            
            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
              <p className="text-xs text-center text-gray-500 dark:text-dark-textMuted mb-3">
                We accept
              </p>
              <div className="flex justify-center gap-4">
                <span className="text-xl">💳</span>
                <span className="text-xl">💵</span>
                <span className="text-xl">🏦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommended Products Section */}
      {items.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.slice(0, 4).map((item) => (
              <Link 
                key={item._id} 
                to={`/product/${item._id}`}
                className="group"
              >
                <div className="bg-white dark:bg-dark-card rounded-lg overflow-hidden border border-gray-200 dark:border-dark-border group-hover:shadow-md transition-shadow">
                  <img
                    src={item.images?.[0]?.url || 'https://via.placeholder.com/200'}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-sm text-boutique-primary font-semibold mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;