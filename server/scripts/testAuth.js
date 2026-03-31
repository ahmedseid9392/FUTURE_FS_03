import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const testAuth = async () => {
  try {
    await connectDB();
    console.log('\n🧪 Testing Authentication System...\n');
    
    // Clean up existing test users
    await User.deleteMany({ email: /test@example.com/ });
    console.log('🧹 Cleaned up existing test users\n');
    
    // Wait a bit for the server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 1: Register a new user
    console.log('📝 Test 1: Register new user...');
    try {
      const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: '+251911234567',
          address: {
            street: '123 Test Street',
            city: 'Addis Ababa',
            state: 'Addis Ababa',
            zipCode: '1000',
            country: 'Ethiopia'
          }
        })
      });
      
      const registerData = await registerResponse.json();
      
      if (registerResponse.ok) {
        console.log('✅ Registration successful!');
        console.log('Token:', registerData.token);
        console.log('User:', registerData.user.name, registerData.user.email);
      } else {
        console.log('❌ Registration failed:', registerData.message);
      }
    } catch (error) {
      console.log('❌ Registration error:', error.message);
    }
    console.log('---\n');
    
    // Test 2: Login with correct credentials
    console.log('📝 Test 2: Login with correct credentials...');
    let token = null;
    try {
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        console.log('✅ Login successful!');
        console.log('Token:', loginData.token);
        console.log('User:', loginData.user.name, loginData.user.email);
        token = loginData.token;
      } else {
        console.log('❌ Login failed:', loginData.message);
      }
    } catch (error) {
      console.log('❌ Login error:', error.message);
    }
    console.log('---\n');
    
    // Test 3: Get profile with valid token
    if (token) {
      console.log('📝 Test 3: Get profile with valid token...');
      try {
        const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const profileData = await profileResponse.json();
        
        if (profileResponse.ok) {
          console.log('✅ Profile retrieved successfully!');
          console.log('User:', profileData.user.name);
          console.log('Email:', profileData.user.email);
        } else {
          console.log('❌ Failed to get profile:', profileData.message);
        }
      } catch (error) {
        console.log('❌ Profile error:', error.message);
      }
      console.log('---\n');
    }
    
    // Test 4: Duplicate email registration
    console.log('📝 Test 4: Register with duplicate email...');
    try {
      const duplicateResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Duplicate User',
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      const duplicateData = await duplicateResponse.json();
      
      if (!duplicateResponse.ok) {
        console.log('✅ Duplicate email correctly rejected:', duplicateData.message);
      } else {
        console.log('❌ Should have failed but succeeded');
      }
    } catch (error) {
      console.log('❌ Duplicate test error:', error.message);
    }
    console.log('---\n');
    
    // Cleanup
    await User.deleteMany({ email: 'test@example.com' });
    console.log('🧹 Cleanup complete');
    console.log('\n🎉 Authentication tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the test
console.log('⚠️  Make sure your server is running on port 5000!');
console.log('Run in another terminal: npm run dev\n');
console.log('Press Enter to continue when server is ready...');

// Wait for user input
process.stdin.once('data', () => {
  testAuth();
});