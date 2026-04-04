import Product from '../models/Product.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Get all products with filtering and related search
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      size,
      color,
      featured,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (size) filter.sizes = size;
    if (color) filter.colors = color;
    
    // Enhanced search: return related products (not just exact matches)
    if (search && search.trim()) {
      const searchTerm = search.trim();
      const searchRegex = new RegExp(searchTerm, 'i');
      
      // Create search score for relevance ranking
      filter.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { tags: { $regex: searchRegex } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    let sortObj = {};
    if (sort === '-createdAt') sortObj = { createdAt: -1 };
    else if (sort === 'price') sortObj = { price: 1 };
    else if (sort === '-price') sortObj = { price: -1 };
    else if (sort === 'name') sortObj = { name: 1 };
    else if (sort === '-rating') sortObj = { averageRating: -1 };
    else sortObj = { createdAt: -1 };

    // Get products with related search
    let products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Product.countDocuments(filter);

    console.log(`Search: "${search}", Found: ${products.length} products`);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('ratings.user', 'name email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * @desc    Delete product (soft delete)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete - set isActive to false
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const products = await Product.getFeatured(parseInt(limit));

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;
    
    const products = await Product.getByCategory(category, parseInt(limit));

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * @desc    Add product review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
export const addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.ratings.find(
      r => r.user.toString() === userId
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Add review
    product.ratings.push({
      user: userId,
      rating: Number(rating),
      review,
      date: new Date()
    });

    // Update average rating
    const totalRatings = product.ratings.length;
    const sumRatings = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = sumRatings / totalRatings;
    product.totalReviews = totalRatings;
    
    await product.save();

    // Return the updated product with populated user
    const updatedProduct = await Product.findById(productId)
      .populate('ratings.user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * @desc    Get product categories
 * @route   GET /api/products/categories/all
 * @access  Public
 */
// In server/controllers/productController.js
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    
    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ category, isActive: true });
        return { name: category, count };
      })
    );

    res.status(200).json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get search suggestions (autocomplete)
 * @route GET /api/products/search/suggestions
 * @access Public
 */
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        data: { suggestions: [] }
      });
    }
    
    // Get product name suggestions
    const nameSuggestions = await Product.find({
      name: { $regex: q, $options: 'i' },
      isActive: true
    })
      .select('name')
      .limit(5);
    
    // Get category suggestions
    const categories = await Product.distinct('category', {
      category: { $regex: q, $options: 'i' },
      isActive: true
    });
    
    // Get tag suggestions
    const tagSuggestions = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$tags' },
      { $match: { tags: { $regex: q, $options: 'i' } } },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const suggestions = [
      ...nameSuggestions.map(p => ({ name: p.name, type: 'product' })),
      ...categories.map(c => ({ name: c, type: 'category' })),
      ...tagSuggestions.map(t => ({ name: t._id, type: 'tag', count: t.count }))
    ];
    
    res.status(200).json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
/**
 * @desc    Get popular products (based on order count or rating)
 * @route   GET /api/products/popular
 * @access  Public
 */
export const getPopularProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get products with highest average rating or most reviews
    const products = await Product.find({ isActive: true })
      .sort({ averageRating: -1, totalReviews: -1, createdAt: -1 })
      .limit(parseInt(limit));
    
    // Extract just the names for popular searches
    const popularSearches = products.map(p => p.name);
    
    res.status(200).json({
      success: true,
      data: { searches: popularSearches.slice(0, 10) }
    });
  } catch (error) {
    console.error('Get popular products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};