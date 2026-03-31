import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Elegant Floral Maxi Dress',
    description: 'Beautiful floral print maxi dress perfect for summer occasions. Made from high-quality cotton blend for ultimate comfort.',
    price: 89.99,
    compareAtPrice: 129.99,
    category: 'dresses',
    images: [
      { url: 'https://images.unsplash.com/photo-1612336307429-8e898d5e00a6?w=400', publicId: 'dress1', isMain: true },
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', publicId: 'dress2' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Red', 'Blue', 'Green'],
    stock: 25,
    isFeatured: true,
    tags: ['dress', 'floral', 'summer', 'maxi']
  },
  {
    name: 'Gold Chain Necklace',
    description: 'Elegant gold chain necklace perfect for any occasion. Timeless piece that adds sophistication to any outfit.',
    price: 49.99,
    compareAtPrice: 79.99,
    category: 'jewelry',
    images: [
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', publicId: 'necklace1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['Gold'],
    stock: 50,
    isFeatured: true,
    tags: ['necklace', 'gold', 'jewelry']
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Stylish leather crossbody bag with multiple compartments. Perfect for daily use.',
    price: 79.99,
    compareAtPrice: 119.99,
    category: 'accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', publicId: 'bag1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['Brown', 'Black', 'Tan'],
    stock: 30,
    isFeatured: true,
    tags: ['bag', 'leather', 'accessories']
  },
  {
    name: 'Silk Scarf',
    description: 'Luxurious silk scarf with artistic print. Adds a touch of elegance to any outfit.',
    price: 34.99,
    compareAtPrice: 54.99,
    category: 'accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400', publicId: 'scarf1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['Multi'],
    stock: 40,
    isFeatured: false,
    tags: ['scarf', 'silk', 'accessories']
  },
  {
    name: 'Pearl Earrings Set',
    description: 'Classic pearl earrings set perfect for both casual and formal wear.',
    price: 29.99,
    compareAtPrice: 49.99,
    category: 'jewelry',
    images: [
      { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', publicId: 'earrings1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['White', 'Cream'],
    stock: 60,
    isFeatured: false,
    tags: ['earrings', 'pearl', 'jewelry']
  },
  {
    name: 'Cashmere Sweater',
    description: 'Soft cashmere sweater for cozy winter days. Available in multiple colors.',
    price: 119.99,
    compareAtPrice: 179.99,
    category: 'new-arrivals',
    images: [
      { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', publicId: 'sweater1', isMain: true }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Navy', 'Burgundy'],
    stock: 20,
    isFeatured: true,
    tags: ['sweater', 'cashmere', 'winter']
  }
];

const createSampleProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');
    
    // Create sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${products.length} sample products`);
    
    products.forEach(product => {
      console.log(`  - ${product.name} ($${product.price})`);
    });
    
  } catch (error) {
    console.error('❌ Error creating sample products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

createSampleProducts();