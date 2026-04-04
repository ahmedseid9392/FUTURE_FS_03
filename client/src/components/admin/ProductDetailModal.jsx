import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  FiX, 
  FiStar, 
  FiHeart, 
  FiShoppingBag, 
  FiPackage,
  FiTag,
  FiGrid,
  FiList,
  FiUsers,
  FiMessageSquare,
  FiThumbsUp,
  FiFlag,
  FiUser,
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiTruck,
  FiRefreshCw,
  FiShield
} from 'react-icons/fi';
import { useCurrencyContext } from '../../context/CurrencyContext';
import RatingStars from '../common/RatingStars';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  const { formatPrice } = useCurrencyContext();
  const [activeTab, setActiveTab] = useState('details');
  const [selectedImage, setSelectedImage] = useState(0);
  
  if (!product) return null;
  
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  
  const tabs = [
    { id: 'details', label: 'Product Details', icon: FiPackage },
    { id: 'reviews', label: `Reviews (${product.ratings?.length || 0})`, icon: FiMessageSquare },
    { id: 'specs', label: 'Specifications', icon: FiGrid }
  ];
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-card text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-dark-border bg-gradient-to-r from-boutique-primary/10 to-transparent">
                  <Dialog.Title as="h3" className="text-xl font-playfair font-bold text-gray-900 dark:text-white">
                    Product Details
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="max-h-[80vh] overflow-y-auto p-6">
                  {/* Product Header */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Product Images */}
                    <div>
                      <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-card">
                        <img
                          src={product.images?.[selectedImage]?.url || product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                          alt={product.name}
                          className="w-full h-80 object-cover"
                        />
                        {discount > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{discount}%
                          </div>
                        )}
                      </div>
                      
                      {/* Thumbnails */}
                      {product.images && product.images.length > 1 && (
                        <div className="flex gap-2 mt-4">
                          {product.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedImage(idx)}
                              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                selectedImage === idx 
                                  ? 'border-boutique-primary' 
                                  : 'border-transparent hover:border-gray-300'
                              }`}
                            >
                              <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {product.name}
                        </h2>
                        <div className="flex items-center gap-3">
                          <RatingStars 
                            rating={product.averageRating || 0} 
                            totalReviews={product.totalReviews || product.ratings?.length || 0} 
                            size="md" 
                          />
                          <span className="text-sm text-gray-500">({product.totalReviews || product.ratings?.length || 0} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-boutique-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {inStock ? (
                          <>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              In Stock ({product.stock} units)
                            </span>
                            {lowStock && (
                              <span className="text-orange-600 text-sm ml-2">(Low Stock)</span>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-red-600 font-medium">Out of Stock</span>
                          </>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-dark-border pt-4">
                        <p className="text-gray-600 dark:text-dark-textMuted">
                          {product.description}
                        </p>
                      </div>
                      
                      {/* Quick Info */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-dark-textMuted">
                          <FiTag className="w-4 h-4" />
                          <span>Category: <span className="font-medium">{product.category}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-dark-textMuted">
                          <FiPackage className="w-4 h-4" />
                          <span>SKU: <span className="font-medium">{product._id?.slice(-8)}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="border-b border-gray-200 dark:border-dark-border">
                    <div className="flex gap-6">
                      {tabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-1 py-3 text-sm font-medium transition-all ${
                            activeTab === tab.id
                              ? 'text-boutique-primary border-b-2 border-boutique-primary'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="py-6">
                    {/* Details Tab */}
                    {activeTab === 'details' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Product Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm"><strong className="text-gray-700 dark:text-dark-text">Name:</strong> {product.name}</p>
                              <p className="text-sm"><strong className="text-gray-700 dark:text-dark-text">Category:</strong> {product.category}</p>
                              <p className="text-sm"><strong className="text-gray-700 dark:text-dark-text">Price:</strong> {formatPrice(product.price)}</p>
                              <p className="text-sm"><strong className="text-gray-700 dark:text-dark-text">Compare Price:</strong> {product.compareAtPrice ? formatPrice(product.compareAtPrice) : 'N/A'}</p>
                              <p className="text-sm"><strong className="text-gray-700 dark:text-dark-text">Stock:</strong> {product.stock} units</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm"><strong className="text-gray-700 dark:text-dark-text">Sizes:</strong> {product.sizes?.join(', ') || 'N/A'}</p>
                              <p className="text-sm"><strong className="text-gray-700 dark:text-dark-text">Colors:</strong> {product.colors?.join(', ') || 'N/A'}</p>
                              <p className="text-sm"><strong className="text-gray-700 dark:text-dark-text">Featured:</strong> {product.isFeatured ? 'Yes' : 'No'}</p>
                              <p className="text-sm"><strong className="text-gray-700 dark:text-dark-text">Tags:</strong> {product.tags?.join(', ') || 'N/A'}</p>
                              <p className="text-sm"><strong className="text-gray-700 dark:text-dark-text">Created:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Shipping Info */}
                        <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <FiTruck className="w-4 h-4" />
                            Shipping Information
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-dark-textMuted">
                            <p>✓ Free shipping on orders over $50</p>
                            <p>✓ 30-day easy returns</p>
                            <p>✓ Secure checkout guaranteed</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                      <div className="space-y-6">
                        {/* Rating Summary */}
                        <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-6 text-center">
                          <div className="flex flex-col items-center">
                            <div className="text-5xl font-bold text-boutique-primary mb-2">
                              {product.averageRating?.toFixed(1) || '0.0'}
                            </div>
                            <RatingStars rating={product.averageRating || 0} size="lg" showCount={false} />
                            <p className="text-sm text-gray-500 mt-2">
                              Based on {product.totalReviews || product.ratings?.length || 0} reviews
                            </p>
                          </div>
                        </div>
                        
                        {/* Reviews List */}
                        {product.ratings && product.ratings.length > 0 ? (
                          <div className="space-y-4">
                            {product.ratings.map((review, idx) => (
                              <div key={idx} className="border-b border-gray-200 dark:border-dark-border pb-4 last:border-0">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-boutique-primary to-boutique-accent rounded-full flex items-center justify-center text-white font-bold">
                                      {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900 dark:text-white">
                                        {review.user?.name || 'Anonymous User'}
                                      </p>
                                      <RatingStars rating={review.rating} size="sm" showCount={false} />
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {new Date(review.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <p className="text-gray-600 dark:text-dark-textMuted mt-2 ml-13">
                                  {review.review}
                                </p>
                                <div className="flex items-center gap-4 mt-3 ml-13">
                                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600">
                                    <FiThumbsUp className="w-3 h-3" />
                                    Helpful
                                  </button>
                                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600">
                                    <FiFlag className="w-3 h-3" />
                                    Report
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FiMessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500 dark:text-dark-textMuted">No reviews yet</p>
                            <p className="text-sm text-gray-400">Be the first to review this product</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Specifications Tab */}
                    {activeTab === 'specs' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="text-md font-semibold text-gray-900 dark:text-white">Basic Specifications</h4>
                            <table className="w-full text-sm">
                              <tbody className="space-y-2">
                                <tr className="border-b border-gray-100 dark:border-dark-border">
                                  <td className="py-2 text-gray-500 w-1/3">Product ID</td>
                                  <td className="py-2 text-gray-900 dark:text-white font-mono">{product._id}</td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-dark-border">
                                  <td className="py-2 text-gray-500">Category</td>
                                  <td className="py-2 text-gray-900 dark:text-white capitalize">{product.category}</td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-dark-border">
                                  <td className="py-2 text-gray-500">Price</td>
                                  <td className="py-2 text-gray-900 dark:text-white">{formatPrice(product.price)}</td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-dark-border">
                                  <td className="py-2 text-gray-500">Stock</td>
                                  <td className="py-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                      {inStock ? `${product.stock} units available` : 'Out of stock'}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="text-md font-semibold text-gray-900 dark:text-white">Additional Details</h4>
                            <table className="w-full text-sm">
                              <tbody>
                                <tr className="border-b border-gray-100 dark:border-dark-border">
                                  <td className="py-2 text-gray-500 w-1/3">Sizes Available</td>
                                  <td className="py-2 text-gray-900 dark:text-white">{product.sizes?.join(', ') || 'One Size'}</td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-dark-border">
                                  <td className="py-2 text-gray-500">Colors Available</td>
                                  <td className="py-2 text-gray-900 dark:text-white">{product.colors?.join(', ') || 'Standard'}</td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-dark-border">
                                  <td className="py-2 text-gray-500">Featured Product</td>
                                  <td className="py-2">
                                    {product.isFeatured ? (
                                      <span className="text-green-600">Yes</span>
                                    ) : (
                                      <span className="text-gray-500">No</span>
                                    )}
                                  </td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-dark-border">
                                  <td className="py-2 text-gray-500">Rating</td>
                                  <td className="py-2">
                                    <div className="flex items-center gap-2">
                                      <RatingStars rating={product.averageRating || 0} size="sm" showCount={false} />
                                      <span className="text-gray-500">({product.totalReviews || 0})</span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                          <div className="pt-4">
                            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {product.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-dark-surface text-xs rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductDetailModal;