import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiEye, FiPackage, FiAlertCircle, FiLock } from 'react-icons/fi';
import { useCartStore } from '../../store/cartStore';
import { useCurrencyContext } from '../../context/CurrencyContext';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addItem);
  const { formatPrice } = useCurrencyContext();
  const { isAuthenticated } = useAuthStore();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      setTimeout(() => navigate('/login'), 1500);
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
  
  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/product/${product._id}`);
  };
  
  const mainImage = product.mainImage || product.images?.[0] || { url: 'https://via.placeholder.com/400' };
  const discount = product.discountPercentage || 0;
  
  // Stock status
  const stockStatus = {
    inStock: product.stock > 0,
    lowStock: product.stock > 0 && product.stock <= 5,
    outOfStock: product.stock === 0
  };
  
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
          
          {/* Stock Badge */}
          {stockStatus.outOfStock && (
            <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3" />
              Out of Stock
            </div>
          )}
          
          {stockStatus.lowStock && !stockStatus.outOfStock && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <FiPackage className="w-3 h-3" />
              Only {product.stock} left
            </div>
          )}
          
          {/* Quick Actions Overlay */}
          {isHovered && !stockStatus.outOfStock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3"
            >
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="p-3 bg-white rounded-full hover:bg-boutique-primary hover:text-white transition-colors disabled:opacity-50"
                title={!isAuthenticated ? "Login to add to cart" : "Add to cart"}
              >
                {!isAuthenticated ? <FiLock className="w-5 h-5" /> : <FiShoppingBag className="w-5 h-5" />}
              </button>
              <button className="p-3 bg-white rounded-full hover:bg-boutique-primary hover:text-white transition-colors">
                <FiHeart className="w-5 h-5" />
              </button>
              <button
                onClick={handleViewDetails}
                className="p-3 bg-white rounded-full hover:bg-boutique-primary hover:text-white transition-colors"
              >
                <FiEye className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
        
        {/* Product Info */}
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
          
          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'fill-current' : 'fill-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.totalReviews || 0})</span>
            </div>
          )}
          
          {/* Stock Status Message */}
          {!stockStatus.outOfStock && (
            <p className={`text-xs ${stockStatus.lowStock ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
              <span className="flex items-center gap-1">
                <FiPackage className="w-3 h-3" />
                {stockStatus.lowStock 
                  ? `Only ${product.stock} left in stock - order soon`
                  : `In Stock (${product.stock} available)`}
              </span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;