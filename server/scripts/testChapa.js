import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const testChapa = async () => {
  console.log('🔍 Testing Chapa Configuration...\n');
  
  console.log('Environment Variables:');
  console.log('CHAPA_SECRET_KEY:', process.env.CHAPA_SECRET_KEY ? '✅ Set' : '❌ Missing');
  console.log('CHAPA_API_URL:', process.env.CHAPA_API_URL || 'https://api.chapa.co/v1');
  console.log('BACKEND_URL:', process.env.BACKEND_URL || 'http://localhost:5000');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:5173');
  
  if (!process.env.CHAPA_SECRET_KEY) {
    console.log('\n❌ ERROR: CHAPA_SECRET_KEY is missing!');
    console.log('Please add it to your .env file');
    console.log('Get your test key from: https://dashboard.chapa.co/');
    return;
  }
  
  console.log('\n📡 Testing Chapa API connection...');
  
  try {
    const response = await axios.get('https://api.chapa.co/v1/transactions/verify/test', {
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
      }
    });
    console.log('✅ Chapa API connection successful');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ Invalid API key! Please check your CHAPA_SECRET_KEY');
    } else {
      console.log('⚠️ API test failed, but might work with valid transaction reference');
    }
  }
  
  console.log('\n✅ Chapa configuration test complete');
};

testChapa();