import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import { productService } from '../services/productService';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeatured = async () => {
      const result = await productService.getFeatured(8);
      if (result.success) {
        setFeaturedProducts(result.data.products);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);
  
  const categories = [
    { name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', path: '/shop?category=dresses' },
    { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', path: '/shop?category=jewelry' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', path: '/shop?category=accessories' },
    { name: 'New Arrivals', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', path: '/shop?category=new-arrivals' },
  ];
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-boutique-light to-white dark:from-dark-bg dark:to-dark-surface transition-colors duration-300">
        <div className="text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-boutique-secondary dark:text-boutique-primary mb-4"
          >
            Welcome to Jams Boutique
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-dark-textMuted mb-8"
          >
            Discover unique fashion pieces that tell your story
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/shop" className="btn-primary text-lg px-8 py-3">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-playfair font-bold text-center text-boutique-secondary dark:text-boutique-primary mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg cursor-pointer"
            >
              <Link to={category.path}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="bg-gray-50 dark:bg-dark-surface py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-center text-boutique-secondary dark:text-boutique-primary mb-4">
            Featured Products
          </h2>
          <p className="text-center text-gray-600 dark:text-dark-textMuted mb-12">
            Our hand-picked selection of must-have pieces
          </p>
          <ProductGrid products={featuredProducts} loading={loading} columns={4} />
          
          <div className="text-center mt-12">
            <Link to="/shop" className="btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-playfair font-bold text-boutique-secondary dark:text-boutique-primary mb-4">
          Stay Updated
        </h2>
        <p className="text-gray-600 dark:text-dark-textMuted mb-8">
          Subscribe to get special offers, new arrivals, and exclusive discounts
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="input-field flex-1"
          />
          <button className="btn-primary">Subscribe</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;