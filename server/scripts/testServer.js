import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testServer = async () => {
  try {
    console.log('🔍 Testing server connection...\n');
    
    // Test health endpoint
    console.log('📝 Test 1: Health check...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check response:', healthData);
    console.log('---\n');
    
    // Test auth routes availability
    console.log('📝 Test 2: Check auth routes...');
    const authResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    
    console.log('Auth route status:', authResponse.status);
    console.log('Auth route response:', await authResponse.text());
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure your server is running on port 5000');
    console.log('Run: npm run dev in another terminal');
  }
};

testServer();