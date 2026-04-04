import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useCartStore } from '../../store/cartStore';
import { useCurrencyContext } from '../../context/CurrencyContext';
import { useAuthStore } from '../../store/authStore';
import { productService } from '../../services/productService';
import RatingStars from '../common/RatingStars';
import toast from 'react-hot-toast';

const RelatedProducts = ({ currentProduct, category, tags, productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addItem);
  const { formatPrice } = useCurrencyContext();
  const { isAuthenticated } = useAuthStore();
  const { items } = useCartStore();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      try {
        // Fetch products from same category
        let products = [];
        
        if (category) {
          const result = await productService.getByCategory(category, 20);
          if (result.success) {
            products = result.data.products || [];
          }
        }
        
        // If not enough products from same category, fetch featured products
        if (products.length < 8) {
          const featuredResult = await productService.getFeatured(12);
          if (featuredResult.success) {
            const featured = featuredResult.data.products || [];
            // Merge and remove duplicates
            const existingIds = new Set(products.map(p => p._id));
            featured.forEach(p => {
              if (!existingIds.has(p._id) && p._id !== productId) {
                products.push(p);
              }
            });
          }
        }
        
        // Filter out current product and limit to 4
        let filtered = products.filter(p => p._id !== productId).slice(0, 4);
        
        // If still not enough, get more products
        if (filtered.length < 4) {
          const allProducts = await productService.getAll({ limit: 20 });
          if (allProducts.success) {
            const moreProducts = allProducts.data.products || [];
            moreProducts.forEach(p => {
              if (!filtered.some(fp => fp._id === p._id) && p._id !== productId && filtered.length < 4) {
                filtered.push(p);
              }
            });
          }
        }
        
        setRelatedProducts(filtered);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatedProducts();
  }, [category, productId]);
  
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    const isInCart = items.some(item => item._id === product._id);
    if (isInCart) {
      toast.error(`${product.name} is already in your cart!`);
      return;
    }
    
    addToCart(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
    toast.success(`${product.name} added to cart!`);
  };
  
  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-dark-card h-48 rounded-lg"></div>
              <div className="mt-2 h-4 bg-gray-200 dark:bg-dark-card rounded w-3/4"></div>
              <div className="mt-1 h-4 bg-gray-200 dark:bg-dark-card rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (relatedProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
        You May Also Like
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <Link to={`/product/${product._id}`} className="block">
              <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-card">
                <img
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Quick Add Button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="p-2 bg-white rounded-full hover:bg-boutique-primary hover:text-white transition-colors"
                  >
                    <FiShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white hover:text-boutique-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-lg font-bold text-boutique-primary">
                    {formatPrice(product.price)}
                  </p>
                  {product.averageRating > 0 && (
                    <RatingStars rating={product.averageRating} size="sm" showCount={false} />
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;