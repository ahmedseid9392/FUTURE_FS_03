import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHeart, 
  FiShoppingBag, 
  FiTrash2, 
  FiArrowLeft,
  FiShoppingCart
} from 'react-icons/fi';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useCurrencyContext } from '../context/CurrencyContext';
import { useAuthStore } from '../store/authStore';
import ConfirmationModal from '../components/common/ConfirmationModal';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, removeItem, clearWishlist, moveToCart } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { formatPrice } = useCurrencyContext();
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [removeItemId, setRemoveItemId] = useState(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
            <FiHeart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-gray-800 dark:text-white mb-4">
            Wishlist is Private
          </h2>
          <p className="text-gray-600 dark:text-dark-textMuted mb-8">
            Please login to view and manage your wishlist
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  const handleRemoveItem = (productId) => {
    removeItem(productId);
    toast.success('Item removed from wishlist');
    setRemoveItemId(null);
  };

  const handleMoveToCart = (product) => {
    moveToCart(product, addToCart);
    toast.success(`${product.name} moved to cart!`);
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success('Wishlist cleared');
    setClearModalOpen(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
            <FiHeart className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-gray-800 dark:text-white mb-4">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 dark:text-dark-textMuted mb-8">
            Save items you love by clicking the heart icon on any product
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingBag className="w-4 h-4" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-dark-textMuted">
            You have {items.length} item{items.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => setClearModalOpen(true)}
            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <FiTrash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-md transition-all group"
          >
            {/* Product Image */}
            <Link to={`/product/${product._id}`} className="block relative">
              <img
                src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Remove Button */}
              <button
                onClick={() => setRemoveItemId(product._id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </Link>

            {/* Product Info */}
            <div className="p-4">
              <Link to={`/product/${product._id}`}>
                <h3 className="font-semibold text-gray-900 dark:text-white hover:text-boutique-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 dark:text-dark-textMuted mt-1">
                {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xl font-bold text-boutique-primary">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-1"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Move to Cart
                </button>
                <Link
                  to={`/product/${product._id}`}
                  className="px-3 py-2 border rounded-md hover:bg-gray-100 transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleClearWishlist}
        title="Clear Wishlist"
        message="Are you sure you want to remove all items from your wishlist? This action cannot be undone."
        confirmText="Yes, Clear All"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={!!removeItemId}
        onClose={() => setRemoveItemId(null)}
        onConfirm={() => handleRemoveItem(removeItemId)}
        title="Remove Item"
        message="Are you sure you want to remove this item from your wishlist?"
        confirmText="Yes, Remove"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default WishlistPage;