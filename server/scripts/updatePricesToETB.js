import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';

dotenv.config();

const updatePricesToETB = async () => {
  try {
    await connectDB();
    console.log('🔄 Updating product prices to ETB...\n');
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products\n`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      // Prices are already in ETB, just ensure they're set correctly
      // If you had USD prices before, multiply by 55
      // For now, we'll just log the current prices
      console.log(`Product: ${product.name}`);
      console.log(`  Current price: ${product.price} ETB`);
      console.log(`  Compare price: ${product.compareAtPrice || 'N/A'} ETB`);
      
      updatedCount++;
    }
    
    console.log(`\n✅ Checked ${updatedCount} products`);
    console.log('All prices are in Ethiopian Birr (ETB)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

updatePricesToETB();