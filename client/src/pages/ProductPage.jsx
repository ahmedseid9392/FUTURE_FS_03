import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingBag, 
  FiHeart, 
  FiShare2, 
  FiMinus, 
  FiPlus, 
  FiCheck, 
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiLock  // Add this import
} from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import { useCurrencyContext } from '../context/CurrencyContext';
import { useAuthStore } from '../store/authStore';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addItem);
  const { formatPrice } = useCurrencyContext();
  const { isAuthenticated } = useAuthStore(); // Add this
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // Fetch product
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id
  });
  
  const product = data?.success ? data.data.product : null;
  
  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [product]);
  
  const handleAddToCart = () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    if (!selectedSize && product?.sizes?.length > 0) {
      toast.error('Please select a size');
      return;
    }
    
    if (!selectedColor && product?.colors?.length > 0) {
      toast.error('Please select a color');
      return;
    }
    
    if (quantity > product?.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    
    setIsAdding(true);
    
    addToCart(product, quantity, selectedSize, selectedColor);
    
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsAdding(false), 500);
  };
  
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    handleAddToCart();
    setTimeout(() => navigate('/cart'), 500);
  };
  
  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < (product?.stock || 10)) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-200 dark:bg-dark-card h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-dark-card rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-card rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 dark:bg-dark-card rounded w-1/3"></div>
              <div className="h-24 bg-gray-200 dark:bg-dark-card rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-dark-card rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Product Not Found</h2>
        <p className="text-gray-600 dark:text-dark-textMuted mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/shop')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }
  
  const mainImage = product.images?.[selectedImage] || product.images?.[0] || { url: 'https://via.placeholder.com/600' };
  const discount = product.discountPercentage || 0;
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500 dark:text-dark-textMuted">
        <button onClick={() => navigate('/')} className="hover:text-boutique-primary">Home</button>
        <span className="mx-2">/</span>
        <button onClick={() => navigate('/shop')} className="hover:text-boutique-primary">Shop</button>
        <span className="mx-2">/</span>
        <span className="text-boutique-primary">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-card">
            <img
              src={mainImage.url}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx 
                      ? 'border-boutique-primary' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img.url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Rating */}
          <div>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">
                  ({product.totalReviews || 0} reviews)
                </span>
              </div>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-boutique-primary">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {inStock ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  In Stock
                </span>
                {lowStock && (
                  <span className="text-orange-600 text-sm">(Only {product.stock} left)</span>
                )}
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>
          
          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md transition-all ${
                      selectedSize === size
                        ? 'border-boutique-primary bg-boutique-primary text-white'
                        : 'border-gray-300 hover:border-boutique-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md transition-all ${
                      selectedColor === color
                        ? 'border-boutique-primary bg-boutique-primary text-white'
                        : 'border-gray-300 hover:border-boutique-primary'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
                className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange('increase')}
                disabled={quantity >= (product.stock || 10)}
                className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <FiPlus className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-500">Available: {product.stock} items</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAdding}
              className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAdding ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <FiShoppingBag className="w-5 h-5" />
              )}
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 btn-secondary py-3 disabled:opacity-50"
            >
              Buy Now
            </button>
            <button className="p-3 border rounded-md hover:bg-gray-100">
              <FiHeart className="w-5 h-5" />
            </button>
          </div>
          
          {/* Login Prompt for Guests */}
          {!isAuthenticated && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                <FiLock className="w-5 h-5" />
                <span className="text-sm">
                  Please <Link to="/login" className="font-semibold underline">login</Link> to add items to cart or purchase
                </span>
              </div>
            </div>
          )}
          
          {/* Shipping Info */}
          <div className="border-t border-gray-200 dark:border-dark-border pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-dark-textMuted">
              <FiTruck className="w-5 h-5" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-dark-textMuted">
              <FiRefreshCw className="w-5 h-5" />
              <span>30-day easy returns</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-dark-textMuted">
              <FiShield className="w-5 h-5" />
              <span>Secure checkout guaranteed</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="flex border-b border-gray-200 dark:border-dark-border">
          {['description', 'details', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'text-boutique-primary border-b-2 border-boutique-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="py-6">
          {activeTab === 'description' && (
            <p className="text-gray-600 dark:text-dark-textMuted leading-relaxed">
              {product.description}
            </p>
          )}
          
          {activeTab === 'details' && (
            <div className="space-y-2 text-gray-600 dark:text-dark-textMuted">
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>SKU:</strong> {product._id?.slice(-8)}</p>
              {product.tags && product.tags.length > 0 && (
                <p><strong>Tags:</strong> {product.tags.join(', ')}</p>
              )}
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              <button className="btn-outline mt-4">Write a Review</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;