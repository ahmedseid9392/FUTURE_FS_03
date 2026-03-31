import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';

/**
 * Create database indexes for better performance
 */
export const createIndexes = async () => {
  try {
    console.log('📊 Creating database indexes...');
    
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ User indexes created');
    
    // Product indexes
    await Product.collection.createIndex({ name: 'text', description: 'text' });
    await Product.collection.createIndex({ category: 1 });
    await Product.collection.createIndex({ price: 1 });
    console.log('✅ Product indexes created');
    
    console.log('✅ All database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

/**
 * Initialize database with default data
 */
export const initDatabase = async () => {
  try {
    // Check if we have any users
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('📝 No users found. Creating default admin user...');
      // We'll add admin creation later
    }
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  }
};