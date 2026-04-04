import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiStar, 
  FiTruck, 
  FiShield, 
  FiRefreshCw,
  FiHeart,
  FiShoppingBag,
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiClock,
  FiChevronRight
} from 'react-icons/fi';
import ProductGrid from '../components/products/ProductGrid';
import { productService } from '../services/productService';

import RecommendationSection from '../components/recommendations/RecommendationSection';
import { useAuthStore } from '../store/authStore';


const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { isAuthenticated } = useAuthStore()
  useEffect(() => {
    const fetchProducts = async () => {
      const featuredResult = await productService.getFeatured(8);
      if (featuredResult.success) {
        setFeaturedProducts(featuredResult.data.products);
      }
      
      const newArrivalsResult = await productService.getAll({ sort: '-createdAt', limit: 4 });
      if (newArrivalsResult.success) {
        setNewArrivals(newArrivalsResult.data.products);
      }
      
      setLoading(false);
    };
    fetchProducts();
  }, []);
  
  const categories = [
    { name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', path: '/shop?category=dresses', count: 45, color: 'from-pink-500 to-rose-500' },
    { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', path: '/shop?category=jewelry', count: 32, color: 'from-amber-500 to-yellow-500' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', path: '/shop?category=accessories', count: 28, color: 'from-purple-500 to-indigo-500' },
    { name: 'New Arrivals', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', path: '/shop?category=new-arrivals', count: 15, color: 'from-green-500 to-emerald-500' },
  ];

  const benefits = [
    { icon: FiTruck, title: 'Free Shipping', description: 'On orders over $50', color: 'text-blue-500' },
    { icon: FiShield, title: 'Secure Payment', description: '100% secure transactions', color: 'text-green-500' },
    { icon: FiRefreshCw, title: 'Easy Returns', description: '30-day return policy', color: 'text-purple-500' },
    { icon: FiClock, title: '24/7 Support', description: 'Customer service', color: 'text-orange-500' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fashion Blogger',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      text: 'Absolutely love the quality and style of products from Jams Boutique. The customer service is exceptional!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Loyal Customer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      text: 'Best online shopping experience I\'ve had. Fast delivery and beautiful packaging. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emma Williams',
      role: 'Style Enthusiast',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      text: 'The jewelry collection is stunning! Every piece is unique and high quality. Will definitely shop again.',
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div>
      {/* Hero Section with Parallax Effect */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 dark:from-black/80 dark:to-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-boutique-primary/20 backdrop-blur-sm rounded-full text-boutique-primary text-sm font-semibold mb-4">
              New Collection 2024
            </span>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
              Discover Your<br />Unique Style
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Explore our curated collection of fashion pieces designed to make you stand out
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/shop" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2 group">
                Shop Now
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-md hover:bg-white/20 transition-all inline-flex items-center gap-2">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-dark-card border-b border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`${benefit.color} w-12 h-12 mx-auto mb-3 bg-opacity-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-500 dark:text-dark-textMuted">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-boutique-primary font-semibold text-sm uppercase tracking-wider">Collection</span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 dark:text-dark-textMuted max-w-2xl mx-auto">
              Our hand-picked selection of must-have pieces that are trending this season
            </p>
          </motion.div>
          
          <ProductGrid products={featuredProducts} loading={loading} columns={4} />
          
          <div className="text-center mt-12">
            <Link to="/shop" className="btn-outline inline-flex items-center gap-2 group">
              View All Products
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* recommendations product section */}
      {isAuthenticated && (
  <RecommendationSection 
    title="Recommended For You" 
    type="personalized" 
    limit={8}
  />
)}

<RecommendationSection 
  title="Trending Now" 
  type="trending" 
  limit={8}
/>

      {/* Categories Section with Hover Effect */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-boutique-primary font-semibold text-sm uppercase tracking-wider">Shop by</span>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 dark:text-white mt-2 mb-4">
            Browse Categories
          </h2>
          <p className="text-gray-600 dark:text-dark-textMuted max-w-2xl mx-auto">
            Explore our diverse collection of fashion categories
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
            >
              <Link to={category.path}>
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-70 transition-opacity duration-300`} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white text-2xl font-bold mb-1">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.count} Products</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold flex items-center gap-2">
                    Shop Now
                    <FiChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Arrivals Banner */}
      <section className="relative py-20 bg-gradient-to-r from-boutique-primary to-boutique-accent overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white"
            >
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                Just Arrived
              </span>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
                New Collection<br />2024
              </h2>
              <p className="text-white/90 mb-8 text-lg">
                Discover our latest arrivals featuring the hottest trends of the season.
                Fresh styles, better prices, and exclusive designs.
              </p>
              <Link to="/shop?category=new-arrivals" className="inline-flex items-center gap-2 bg-white text-boutique-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors group">
                Shop New Arrivals
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {newArrivals.slice(0, 4).map((product, idx) => (
                <Link key={idx} to={`/product/${product._id}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform group-hover:-translate-y-2">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
                      <p className="text-boutique-primary font-bold mt-1">{productService.formatPrice?.(product.price) || `$${product.price}`}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-boutique-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 dark:text-white mt-2 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 dark:text-dark-textMuted max-w-2xl mx-auto">
              Join thousands of satisfied customers who love shopping with us
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 lg:-ml-12 p-2 bg-white dark:bg-dark-card rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <FiChevronRight className="w-6 h-6 rotate-180" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 lg:-mr-12 p-2 bg-white dark:bg-dark-card rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>

              <div className="text-center p-8">
                <img
                  src={testimonials[activeTestimonial].image}
                  alt={testimonials[activeTestimonial].name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-boutique-primary"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-dark-textMuted text-lg italic mb-6">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <h4 className="font-semibold text-gray-900 dark:text-white">{testimonials[activeTestimonial].name}</h4>
                <p className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeTestimonial ? 'w-8 bg-boutique-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section with Animation */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-boutique-primary to-boutique-accent rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Subscribe to get special offers, free giveaways, and exclusive deals
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-boutique-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105">
                Subscribe
              </button>
            </form>
            <p className="text-white/70 text-sm mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-boutique-primary font-semibold text-sm uppercase tracking-wider">Social Media</span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Follow Us @jamsboutique
            </h2>
            <p className="text-gray-600 dark:text-dark-textMuted max-w-2xl mx-auto">
              Get daily inspiration and exclusive previews on Instagram
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <motion.a
                key={item}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                className="group relative overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={`https://images.unsplash.com/photo-${item === 1 ? '1490481651871-ab68de25d43d' : item === 2 ? '1483985988559-526b3c4e1b9c' : item === 3 ? '1445205170468-3b9b4e7c5f6e' : '1485875437342-9b394f3b3f3e'}?w=400`}
                  alt="Instagram"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiHeart className="w-8 h-8 text-white" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;