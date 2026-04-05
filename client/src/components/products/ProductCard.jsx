import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiEye, FiPackage, FiCheck } from 'react-icons/fi';
import { useCartStore } from '../../store/cartStore';
import { useCurrencyContext } from '../../context/CurrencyContext';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import RatingStars from '../common/RatingStars';
import { useWishlistStore } from '../../store/wishlistStore';




const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addItem);
  const { items } = useCartStore();
  const { formatPrice } = useCurrencyContext();
  const { isAuthenticated } = useAuthStore();

  // Add state for selected variant (for display only)
const [selectedVariantSize, setSelectedVariantSize] = useState('');
const [selectedVariantColor, setSelectedVariantColor] = useState('');
  
  // Check if product is already in cart
  const isInCart = items.some(item => item._id === product._id);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    // Check if product already in cart
    if (isInCart) {
      toast.error(`${product.name} is already in your cart!`);
      return;
    }
    
    if (product.stock <= 0) {
      toast.error(`${product.name} is out of stock!`);
      return;
    }
    
    setIsLoading(true);
    
    // Add to cart with default options
    addToCart(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
    
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsLoading(false), 500);
  };
  
  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to like products');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
const [isWishlisted, setIsWishlisted] = useState(false);

// Check if product is in wishlist on mount
useEffect(() => {
  if (product) {
    setIsWishlisted(isInWishlist(product._id));
  }
}, [product, isInWishlist]);

// Handle wishlist toggle
const handleWishlistToggle = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!isAuthenticated) {
    toast.error('Please login to add items to wishlist');
    setTimeout(() => navigate('/login'), 1500);
    return;
  }
  
  if (isWishlisted) {
    removeFromWishlist(product._id);
    setIsWishlisted(false);
    toast.success('Removed from wishlist');
  } else {
    addToWishlist(product);
    setIsWishlisted(true);
    toast.success('Added to wishlist');
  }
};
  
  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/product/${product._id}`);
  };
  
  const mainImage = product.mainImage || product.images?.[0] || { url: 'https://via.placeholder.com/400' };
  const discount = product.discountPercentage || 0;
  
  // Stock status - only for internal use, not displayed
  const isOutOfStock = product.stock === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="block cursor-pointer" onClick={handleViewDetails}>
        <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-card">
          {/* Product Image */}
          <img
            src={mainImage.url}
            alt={product.name}
            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
          
          {/* In Cart Badge */}
          {isInCart && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <FiCheck className="w-3 h-3" />
              In Cart
            </div>
          )}
          
          {/* Quick Actions Overlay */}
          {isHovered && !isOutOfStock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3"
            >
              <button
                onClick={handleAddToCart}
                disabled={isLoading || isInCart}
                className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                  isInCart 
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'bg-white text-gray-800 hover:bg-boutique-primary hover:text-white'
                }`}
                title={isInCart ? "Already in cart" : "Add to cart"}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-boutique-primary"></div>
                ) : (
                  <FiShoppingBag className="w-5 h-5" />
                )}
              </button>
              
              <button
  onClick={handleWishlistToggle}
  className={`p-3 rounded-full transition-all transform hover:scale-110 ${
    isWishlisted 
      ? 'bg-red-500 text-white'
      : 'bg-white text-gray-800 hover:bg-red-500 hover:text-white'
  }`}
  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
>
  <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
</button>

              
              <button
                onClick={handleViewDetails}
                className="p-3 bg-white rounded-full hover:bg-boutique-primary hover:text-white transition-all transform hover:scale-110"
                title="Quick view"
              >
                <FiEye className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
        
        {/* Product Info - No stock display */}
        <div className="mt-4 space-y-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-boutique-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-dark-textMuted">
            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
          </p>
          
          {/* Price with Currency */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-boutique-primary">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
 {/* Sizes */}
{product.sizes && product.sizes.length > 0 && (
  <div className="mt-2">
    <div className="flex items-center gap-1 flex-wrap">
      {product.sizes.slice(0, 4).map(size => (
        <span
          key={size}
          className="text-xs px-2 py-0.5 border rounded-md bg-gray-50 dark:bg-dark-card"
        >
          {size}
        </span>
      ))}
      {product.sizes.length > 4 && (
        <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
      )}
    </div>
  </div>
)}

{/* Colors */}
{product.colors && product.colors.length > 0 && (
  <div className="mt-2">
    <div className="flex items-center gap-1 flex-wrap">
      {product.colors.slice(0, 5).map(color => (
        <div
          key={color}
          className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
          style={{ backgroundColor: color.toLowerCase() }}
          title={color}
        />
      ))}
      {product.colors.length > 5 && (
        <span className="text-xs text-gray-400">+{product.colors.length - 5}</span>
      )}
    </div>
  </div>
)}
          
          {/* Rating */}
{product.averageRating > 0 && (
  <RatingStars 
    rating={product.averageRating} 
    totalReviews={product.totalReviews} 
    size="sm" 
  />
)}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;