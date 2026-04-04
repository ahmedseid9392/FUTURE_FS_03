import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

class RecommendationService {
  /**
   * Get personalized recommendations for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Recommended products
   */
  async getPersonalizedRecommendations(userId) {
    try {
      // Get user's order history
      const userOrders = await Order.find({ user: userId, orderStatus: 'delivered' })
        .populate('items.product')
        .limit(10);
      
      // Get user's cart items
      // Note: Cart is stored in frontend, so we'll pass it as parameter
      
      // Get user's liked products (from wishlist - to be implemented)
      
      // Get user's browsing history (from analytics - to be implemented)
      
      return await this.generateRecommendations(userId, userOrders);
    } catch (error) {
      console.error('Recommendation error:', error);
      return [];
    }
  }

  /**
   * Generate recommendations based on purchase history
   */
  async generateRecommendations(userId, userOrders) {
    try {
      let recommendedProducts = [];
      
      // 1. Based on purchase history (Collaborative Filtering)
      if (userOrders.length > 0) {
        const purchasedCategories = new Set();
        const purchasedTags = new Set();
        const purchasedProducts = new Set();
        
        userOrders.forEach(order => {
          order.items.forEach(item => {
            if (item.product) {
              purchasedProducts.add(item.product._id.toString());
              purchasedCategories.add(item.product.category);
              if (item.product.tags) {
                item.product.tags.forEach(tag => purchasedTags.add(tag));
              }
            }
          });
        });
        
        // Find products in same categories
        const categoryProducts = await Product.find({
          category: { $in: Array.from(purchasedCategories) },
          _id: { $nin: Array.from(purchasedProducts) },
          isActive: true
        }).limit(10);
        
        recommendedProducts.push(...categoryProducts);
        
        // Find products with similar tags
        if (recommendedProducts.length < 10 && purchasedTags.size > 0) {
          const tagProducts = await Product.find({
            tags: { $in: Array.from(purchasedTags) },
            _id: { $nin: Array.from(purchasedProducts) },
            isActive: true
          }).limit(10 - recommendedProducts.length);
          
          recommendedProducts.push(...tagProducts);
        }
      }
      
      // 2. Get popular products (fallback)
      if (recommendedProducts.length < 10) {
        const popularProducts = await Product.find({ isActive: true })
          .sort({ averageRating: -1, totalReviews: -1 })
          .limit(10 - recommendedProducts.length);
        
        // Avoid duplicates
        const existingIds = new Set(recommendedProducts.map(p => p._id.toString()));
        popularProducts.forEach(product => {
          if (!existingIds.has(product._id.toString())) {
            recommendedProducts.push(product);
          }
        });
      }
      
      return recommendedProducts.slice(0, 10);
    } catch (error) {
      console.error('Generate recommendations error:', error);
      return [];
    }
  }

  /**
   * Get frequently bought together products
   * @param {string} productId - Current product ID
   * @returns {Promise<Array>} - Frequently bought together products
   */
  async getFrequentlyBoughtTogether(productId) {
    try {
      // Find orders that contain this product
      const orders = await Order.find({
        'items.product': productId,
        orderStatus: 'delivered'
      }).populate('items.product');
      
      // Count co-occurrence of products
      const productCount = new Map();
      
      orders.forEach(order => {
        order.items.forEach(item => {
          if (item.product && item.product._id.toString() !== productId) {
            const id = item.product._id.toString();
            productCount.set(id, (productCount.get(id) || 0) + 1);
          }
        });
      });
      
      // Get top 4 products
      const topProductIds = Array.from(productCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(entry => entry[0]);
      
      const products = await Product.find({
        _id: { $in: topProductIds },
        isActive: true
      });
      
      return products;
    } catch (error) {
      console.error('Frequently bought together error:', error);
      return [];
    }
  }

  /**
   * Get recommendations based on cart items
   * @param {Array} cartItems - Items in cart
   * @returns {Promise<Array>} - Recommended products
   */
  async getCartBasedRecommendations(cartItems) {
    try {
      if (!cartItems || cartItems.length === 0) {
        return [];
      }
      
      const cartProductIds = cartItems.map(item => item._id);
      const cartCategories = new Set();
      const cartTags = new Set();
      
      // Get product details
      const products = await Product.find({ _id: { $in: cartProductIds } });
      
      products.forEach(product => {
        cartCategories.add(product.category);
        if (product.tags) {
          product.tags.forEach(tag => cartTags.add(tag));
        }
      });
      
      // Find complementary products
      const recommendations = await Product.find({
        $or: [
          { category: { $in: Array.from(cartCategories) } },
          { tags: { $in: Array.from(cartTags) } }
        ],
        _id: { $nin: cartProductIds },
        isActive: true
      })
        .limit(8);
      
      return recommendations;
    } catch (error) {
      console.error('Cart based recommendations error:', error);
      return [];
    }
  }

  /**
   * Get "You May Also Like" recommendations
   * @param {string} productId - Current product ID
   * @returns {Promise<Array>} - Similar products
   */
  async getSimilarProducts(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) return [];
      
      // Find similar products by category and tags
      const similar = await Product.find({
        $or: [
          { category: product.category },
          { tags: { $in: product.tags || [] } }
        ],
        _id: { $ne: productId },
        isActive: true
      })
        .limit(6);
      
      // If not enough, get top rated products
      if (similar.length < 6) {
        const topRated = await Product.find({
          _id: { $ne: productId, $nin: similar.map(p => p._id) },
          isActive: true
        })
          .sort({ averageRating: -1 })
          .limit(6 - similar.length);
        
        similar.push(...topRated);
      }
      
      return similar;
    } catch (error) {
      console.error('Similar products error:', error);
      return [];
    }
  }

  /**
   * Get trending products
   * @returns {Promise<Array>} - Trending products
   */
  async getTrendingProducts() {
    try {
      // Get products with highest sales in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const trending = await Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, orderStatus: 'delivered' } },
        { $unwind: '$items' },
        { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      const productIds = trending.map(t => t._id);
      const products = await Product.find({ _id: { $in: productIds }, isActive: true });
      
      // Sort by trending order
      return productIds.map(id => products.find(p => p._id.toString() === id.toString())).filter(p => p);
    } catch (error) {
      console.error('Trending products error:', error);
      return [];
    }
  }
}

export default new RecommendationService();