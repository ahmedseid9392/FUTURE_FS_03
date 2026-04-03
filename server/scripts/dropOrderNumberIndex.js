import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Order from '../models/Order.js';

dotenv.config();

const dropOrderNumberIndex = async () => {
  try {
    await connectDB();
    console.log('🔍 Dropping orderNumber index...\n');
    
    // Drop the index
    await Order.collection.dropIndex('orderNumber_1');
    console.log('✅ Successfully dropped orderNumber_1 index');
    
    // Create new sparse index
    await Order.collection.createIndex({ orderNumber: 1 }, { unique: true, sparse: true });
    console.log('✅ Created new sparse index on orderNumber');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

dropOrderNumberIndex();