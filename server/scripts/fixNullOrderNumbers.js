import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Order from '../models/Order.js';

dotenv.config();

const fixNullOrderNumbers = async () => {
  try {
    await connectDB();
    console.log('🔍 Fixing orders with null orderNumber...\n');
    
    // Find orders with null or missing orderNumber
    const orders = await Order.find({
      $or: [
        { orderNumber: null },
        { orderNumber: { $exists: false } }
      ]
    });
    
    console.log(`Found ${orders.length} orders with missing order numbers\n`);
    
    let fixedCount = 0;
    
    for (const order of orders) {
      const date = order.createdAt || new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      order.orderNumber = `JAMS-${year}${month}${day}-${random}`;
      await order.save();
      fixedCount++;
      console.log(`✅ Fixed order: ${order._id} -> ${order.orderNumber}`);
    }
    
    console.log(`\n✅ Successfully fixed ${fixedCount} orders`);
    
    // Verify all orders now have orderNumber
    const remainingNull = await Order.countDocuments({
      $or: [
        { orderNumber: null },
        { orderNumber: { $exists: false } }
      ]
    });
    
    console.log(`\n📊 Remaining orders without orderNumber: ${remainingNull}`);
    
  } catch (error) {
    console.error('❌ Error fixing orders:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

fixNullOrderNumbers();