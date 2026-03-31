import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const testOrders = async () => {
  try {
    await connectDB();
    console.log('\n🧪 Testing Order Management...\n');
    
    // Clean up existing test orders
    await Order.deleteMany({ 'shippingAddress.email': 'test@example.com' });
    console.log('🧹 Cleaned up existing test orders\n');
    
    // Login to get token
    console.log('📝 Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    let token;
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      token = loginData.token;
      console.log('✅ Login successful\n');
    } else {
      console.log('❌ Login failed. Please create a test user first.\n');
      return;
    }
    
    // First, create a test product
    console.log('📝 Creating test product...');
    const adminLogin = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    let adminToken = null;
    if (adminLogin.ok) {
      const adminData = await adminLogin.json();
      adminToken = adminData.token;
    }
    
    let productId;
    if (adminToken) {
      const productResponse = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: 'Test Product for Order',
          description: 'This is a test product for order testing',
          price: 29.99,
          category: 'dresses',
          images: [{
            url: 'https://via.placeholder.com/400',
            publicId: 'test123'
          }],
          stock: 100
        })
      });
      
      if (productResponse.ok) {
        const productData = await productResponse.json();
        productId = productData.product._id;
        console.log('✅ Test product created\n');
      }
    }
    
    if (!productId) {
      console.log('⚠️  Using existing product...');
      const existingProduct = await Product.findOne({ isActive: true });
      if (existingProduct) {
        productId = existingProduct._id;
        console.log(`✅ Using product: ${existingProduct.name}\n`);
      }
    }
    
    // Test 1: Create order
    console.log('📝 Test 1: Create new order...');
    const createResponse = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [{
          product: productId,
          quantity: 2,
          size: 'M',
          color: 'Blue'
        }],
        shippingAddress: {
          fullName: 'Test User',
          street: '123 Test Street',
          city: 'Addis Ababa',
          state: 'Addis Ababa',
          zipCode: '1000',
          country: 'Ethiopia',
          phone: '+251911234567',
          email: 'test@example.com'
        },
        paymentMethod: 'cash',
        notes: 'Please call before delivery'
      })
    });
    
    const orderData = await createResponse.json();
    let orderId;
    
    if (createResponse.ok) {
      console.log('✅ Order created successfully!');
      console.log('Order Number:', orderData.order.orderNumber);
      console.log('Total Amount:', orderData.order.totalAmount);
      orderId = orderData.order._id;
    } else {
      console.log('❌ Failed to create order:', orderData.message);
    }
    console.log('---\n');
    
    // Test 2: Get my orders
    console.log('📝 Test 2: Get my orders...');
    const myOrdersResponse = await fetch('http://localhost:5000/api/orders/my-orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const myOrders = await myOrdersResponse.json();
    
    if (myOrdersResponse.ok) {
      console.log('✅ Retrieved my orders!');
      console.log(`Total orders: ${myOrders.pagination.total}`);
      myOrders.orders.forEach(order => {
        console.log(`  - ${order.orderNumber}: ${order.orderStatus} ($${order.totalAmount})`);
      });
    }
    console.log('---\n');
    
    // Test 3: Get single order
    if (orderId) {
      console.log('📝 Test 3: Get order by ID...');
      const orderResponse = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const order = await orderResponse.json();
      
      if (orderResponse.ok) {
        console.log('✅ Retrieved order details!');
        console.log('Order Number:', order.order.orderNumber);
        console.log('Status:', order.order.orderStatus);
        console.log('Items:', order.order.items.length);
      }
      console.log('---\n');
    }
    
    // Test 4: Update order status (admin)
    if (orderId && adminToken) {
      console.log('📝 Test 4: Update order status (admin)...');
      const updateResponse = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: 'processing',
          note: 'Order confirmed and processing'
        })
      });
      
      const updateData = await updateResponse.json();
      
      if (updateResponse.ok) {
        console.log('✅ Order status updated!');
        console.log('New Status:', updateData.order.orderStatus);
      } else {
        console.log('❌ Failed to update status:', updateData.message);
      }
      console.log('---\n');
    }
    
    // Test 5: Cancel order
    if (orderId) {
      console.log('📝 Test 5: Cancel order...');
      const cancelResponse = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: 'Changed my mind'
        })
      });
      
      const cancelData = await cancelResponse.json();
      
      if (cancelResponse.ok) {
        console.log('✅ Order cancelled successfully!');
      } else {
        console.log('❌ Failed to cancel order:', cancelData.message);
      }
      console.log('---\n');
    }
    
    // Test 6: Get order stats (admin)
    if (adminToken) {
      console.log('📝 Test 6: Get order statistics (admin)...');
      const statsResponse = await fetch('http://localhost:5000/api/orders/stats/overview', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      const stats = await statsResponse.json();
      
      if (statsResponse.ok) {
        console.log('✅ Retrieved order statistics!');
        console.log('Total Orders:', stats.stats.totalOrders);
        console.log('Total Revenue:', stats.stats.totalRevenue);
        console.log('Average Order Value:', stats.stats.averageOrderValue);
      }
      console.log('---\n');
    }
    
    console.log('🎉 Order tests completed!');
    
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
  testOrders();
});