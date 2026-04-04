import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiTrendingUp, FiUser, FiShoppingBag } from 'react-icons/fi';
import ProductCard from '../products/ProductCard';
import { recommendationService } from '../../services/recommendationService';
import { useAuthStore } from '../../store/authStore';

const RecommendationSection = ({ title, type, productId = null, cartItems = null, limit = 6 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    fetchRecommendations();
  }, [type, productId, cartItems]);
  
  const fetchRecommendations = async () => {
    setLoading(true);
    let result = { success: false, data: [] };
    
    try {
      switch (type) {
        case 'personalized':
          if (isAuthenticated) {
            result = await recommendationService.getPersonalizedRecommendations();
          }
          break;
        case 'frequently-bought':
          if (productId) {
            result = await recommendationService.getFrequentlyBoughtTogether(productId);
          }
          break;
        case 'cart-based':
          if (cartItems && cartItems.length > 0) {
            result = await recommendationService.getCartBasedRecommendations(cartItems);
          }
          break;
        case 'similar':
          if (productId) {
            result = await recommendationService.getSimilarProducts(productId);
          }
          break;
        case 'trending':
          result = await recommendationService.getTrendingProducts();
          break;
        default:
          break;
      }
      
      if (result.success && result.data) {
        setProducts(result.data.slice(0, limit));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading || products.length === 0) {
    return null;
  }
  
  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  const getIcon = () => {
    switch (type) {
      case 'personalized': return <FiUser className="w-5 h-5" />;
      case 'trending': return <FiTrendingUp className="w-5 h-5" />;
      case 'cart-based': return <FiShoppingBag className="w-5 h-5" />;
      default: return null;
    }
  };
  
  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        
        {totalPages > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;