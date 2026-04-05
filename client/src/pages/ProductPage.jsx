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
  FiLock,
  FiMaximize2
} from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import { useCurrencyContext } from '../context/CurrencyContext';
import { useAuthStore } from '../store/authStore';
import { productService } from '../services/productService';
import RatingStars from '../components/common/RatingStars';
import ReviewCard from '../components/products/ReviewCard';
import ReviewForm from '../components/products/ReviewForm';
import RelatedProducts from '../components/products/RelatedProducts';
import toast from 'react-hot-toast';
import RecommendationSection from '../components/recommendations/RecommendationSection';
import { useWishlistStore } from '../store/wishlistStore';
const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addToCart } = useCartStore();
  const { formatPrice } = useCurrencyContext();
  const { isAuthenticated, user } = useAuthStore();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [productData, setProductData] = useState(null);

  // Fetch product
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id
  });

  // Extract product from response
  const product = data?.data?.product || data?.product || null;

  // Update local product data when fetched
  useEffect(() => {
    if (product) {
      setProductData(product);
      setReviews(product.ratings || []);
    }
  }, [product]);

  // Debug logging
  console.log('API Response:', data);
  console.log('Extracted Product:', product);
  console.log('Reviews:', reviews);

  // Check if product is already in cart
  const isInCart = product ? items.some(item => item._id === product._id) : false;

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
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (isInCart) {
      toast.error(`${product.name} is already in your cart!`);
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

    if (isInCart) {
      toast.error(`${product.name} is already in your cart. Proceed to checkout.`);
      setTimeout(() => navigate('/cart'), 500);
      return;
    }

    handleAddToCart();
    setTimeout(() => navigate('/cart'), 500);
  };

  const handleLike = () => {
  if (!isAuthenticated) {
    toast.error('Please login to add items to wishlist');
    setTimeout(() => navigate('/login'), 1500);
    return;
  }
  
  if (isLiked) {
    removeFromWishlist(product._id);
    setIsLiked(false);
    toast.success('Removed from wishlist');
  } else {
    addToWishlist(product);
    setIsLiked(true);
    toast.success('Added to wishlist');
  }
};
  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < (product?.stock || 10)) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleSubmitReview = async (productId, reviewData) => {
    console.log('Submitting review for product:', productId, reviewData);
    setReviewLoading(true);
    try {
      const result = await productService.addReview(productId, reviewData);
      console.log('Review submission result:', result);

      if (result.success) {
        // Refetch product to get updated ratings and reviews
        const updatedProduct = await productService.getById(productId);
        if (updatedProduct.success) {
          const newProductData = updatedProduct.data?.product || updatedProduct.product;
          setProductData(newProductData);
          setReviews(newProductData.ratings || []);
          // Refetch the query to update all data
          refetch();
        }
        return { success: true };
      } else {
        const errorMsg = result.message || 'Failed to submit review';
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review');
      return { success: false, message: 'Failed to submit review' };
    } finally {
      setReviewLoading(false);
    }
  };

  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

// Check if product is in wishlist
useEffect(() => {
  if (product) {
    setIsLiked(isInWishlist(product._id));
  }
}, [product, isInWishlist]);


  const handleHelpfulReview = (reviewId) => {
    console.log('Helpful clicked for review:', reviewId);
    toast.success('Thank you for your feedback!');
  };

  const handleReportReview = (reviewId) => {
    console.log('Reported review:', reviewId);
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
  const allImages = product.images || [mainImage];
  const averageRating = product.averageRating || 0;
  const totalReviews = product.totalReviews || reviews.length || 0;

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
          {/* Main Image with Click to Zoom */}
          <div
            className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-card cursor-pointer group"
            onClick={() => openLightbox(selectedImage)}
          >
            <img
              src={mainImage.url}
              alt={product.name}
              className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 rounded-full p-3">
                <FiMaximize2 className="w-6 h-6 text-gray-800" />
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-4">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
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
              <RatingStars rating={averageRating} totalReviews={totalReviews} size="md" />
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
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* In Cart Alert */}
          {isInCart && (
            <div className="bg-green-100 dark:bg-green-900/20 border border-green-500 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <FiCheck className="w-5 h-5" />
                <span className="text-sm">This item is already in your cart</span>
              </div>
            </div>
          )}

          {/* Size Selection */}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Size <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`relative px-5 py-2 border-2 rounded-lg transition-all ${selectedSize === size
                        ? 'border-boutique-primary bg-boutique-primary/10 text-boutique-primary'
                        : 'border-gray-300 hover:border-boutique-primary'
                      }`}
                  >
                    {size}
                    {selectedSize === size && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-boutique-primary rounded-full flex items-center justify-center">
                        <FiCheck className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/*  Color Selection with better styling */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                        ? 'border-boutique-primary scale-110'
                        : 'border-gray-300 hover:scale-105'
                      }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <FiCheck className="w-4 h-4 text-white drop-shadow-md" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: <span className="font-medium">{selectedColor}</span>
                </p>
              )}
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
              <span className="text-sm text-gray-500">Max: {product.stock}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAdding || isInCart}
              className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-md transition-all ${isInCart
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'btn-primary disabled:opacity-50'
                }`}
            >
              {isAdding ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : isInCart ? (
                <>
                  <FiCheck className="w-5 h-5" />
                  Already in Cart
                </>
              ) : (
                <>
                  <FiShoppingBag className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 btn-secondary py-3 disabled:opacity-50"
            >
              Buy Now
            </button>

            <button
              onClick={handleLike}
              className={`p-3 border rounded-md transition-all hover:scale-105 ${isLiked
                  ? 'bg-red-500 text-white border-red-500'
                  : 'hover:bg-gray-100'
                }`}
            >
              <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
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
              className={`px-6 py-3 font-medium capitalize transition-all ${activeTab === tab
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
            <div className="space-y-8">
              {/* Review Form - Only for logged in users */}
              {isAuthenticated ? (
                <div className="border-b border-gray-200 dark:border-dark-border pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Write a Review
                  </h3>
                  <ReviewForm
                    productId={product._id}
                    onSubmit={handleSubmitReview}
                    onSuccess={() => {
                      setTimeout(() => {
                        const reviewsSection = document.getElementById('reviews-section');
                        if (reviewsSection) {
                          reviewsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    loading={reviewLoading}
                  />
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center mb-8">
                  <p className="text-yellow-800 dark:text-yellow-400">
                    Please <Link to="/login" className="font-semibold underline">login</Link> to write a review
                  </p>
                </div>
              )}

              {/* Reviews List */}
              <div id="reviews-section">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Customer Reviews ({reviews.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={averageRating} totalReviews={reviews.length} size="md" />
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-dark-surface rounded-lg">
                    <p className="text-gray-500 dark:text-dark-textMuted">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {reviews.map((review, index) => (
                      <ReviewCard
                        key={review._id || index}
                        review={{
                          ...review,
                          user: review.user || { name: 'Anonymous User' }
                        }}
                        onHelpful={handleHelpfulReview}
                        onReport={handleReportReview}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simple Lightbox Modal */}
      <RelatedProducts
        currentProduct={product}
        category={product.category}
        tags={product.tags}
        productId={product._id}
      />

      <RecommendationSection
        title="Frequently Bought Together"
        type="frequently-bought"
        productId={product._id}
        limit={4}
      />

      <RecommendationSection
        title="You May Also Like"
        type="similar"
        productId={product._id}
        limit={4}
      />
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            ×
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                }}
                className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev + 1) % allImages.length);
                }}
                className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
              >
                ›
              </button>
            </>
          )}

          <img
            src={allImages[lightboxIndex]?.url}
            alt="Product"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>

  );
};

export default ProductPage;