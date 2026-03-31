import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const testProducts = async () => {
  try {
    await connectDB();
    console.log('\n🧪 Testing Product Management...\n');
    
    // Clean up existing test products
    await Product.deleteMany({ name: /Test Product/ });
    console.log('🧹 Cleaned up existing test products\n');
    
    // Get admin token (you need to login first)
    console.log('📝 First, login to get admin token...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com', // You need to create an admin user first
        password: 'admin123'
      })
    });
    
    let token;
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      token = loginData.token;
      console.log('✅ Admin login successful');
    } else {
      console.log('⚠️  Admin login failed, creating product without auth...');
    }
    console.log('---\n');
    
    // Test 1: Create a product (if admin)
    if (token) {
      console.log('📝 Test 1: Create new product...');
      const createResponse = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'Test Product',
          description: 'This is a test product for Jams Boutique',
          price: 49.99,
          compareAtPrice: 69.99,
          category: 'dresses',
          images: [{
            url: 'https://via.placeholder.com/400',
            publicId: 'test123',
            isMain: true
          }],
          sizes: ['S', 'M', 'L'],
          colors: ['Red', 'Blue'],
          stock: 10,
          isFeatured: true,
          tags: ['test', 'dress']
        })
      });
      
      const productData = await createResponse.json();
      
      if (createResponse.ok) {
        console.log('✅ Product created successfully!');
        console.log('Product ID:', productData.product._id);
        console.log('Product Name:', productData.product.name);
        console.log('Price:', productData.product.price);
      } else {
        console.log('❌ Failed to create product:', productData.message);
      }
      console.log('---\n');
    }
    
    // Test 2: Get all products
    console.log('📝 Test 2: Get all products...');
    const allProductsResponse = await fetch('http://localhost:5000/api/products');
    const allProducts = await allProductsResponse.json();
    
    if (allProductsResponse.ok) {
      console.log('✅ Retrieved products successfully!');
      console.log(`Total products: ${allProducts.pagination.total}`);
      console.log(`Products in page: ${allProducts.products.length}`);
    } else {
      console.log('❌ Failed to get products');
    }
    console.log('---\n');
    
    // Test 3: Get featured products
    console.log('📝 Test 3: Get featured products...');
    const featuredResponse = await fetch('http://localhost:5000/api/products/featured?limit=5');
    const featuredProducts = await featuredResponse.json();
    
    if (featuredResponse.ok) {
      console.log('✅ Retrieved featured products!');
      console.log(`Featured products count: ${featuredProducts.products.length}`);
    }
    console.log('---\n');
    
    // Test 4: Get categories
    console.log('📝 Test 4: Get product categories...');
    const categoriesResponse = await fetch('http://localhost:5000/api/products/categories/all');
    const categories = await categoriesResponse.json();
    
    if (categoriesResponse.ok) {
      console.log('✅ Retrieved categories!');
      categories.categories.forEach(cat => {
        console.log(`  - ${cat.name}: ${cat.count} products`);
      });
    }
    console.log('---\n');
    
    // Test 5: Filter products by category
    console.log('📝 Test 5: Filter by category (dresses)...');
    const categoryResponse = await fetch('http://localhost:5000/api/products/category/dresses');
    const categoryProducts = await categoryResponse.json();
    
    if (categoryResponse.ok) {
      console.log(`✅ Found ${categoryProducts.products.length} dresses`);
    }
    console.log('---\n');
    
    // Test 6: Filter with query parameters
    console.log('📝 Test 6: Filter with min price...');
    const filterResponse = await fetch('http://localhost:5000/api/products?minPrice=40&maxPrice=60');
    const filteredProducts = await filterResponse.json();
    
    if (filterResponse.ok) {
      console.log(`✅ Found ${filteredProducts.products.length} products between $40-$60`);
    }
    console.log('---\n');
    
    console.log('🎉 Product tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

console.log('⚠️  Make sure your server is running on port 5000!');
console.log('Run in another terminal: npm run dev\n');
console.log('Press Enter to continue when server is ready...');

process.stdin.once('data', () => {
  testProducts();
});