import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const updateAdminProfileImage = async () => {
  try {
    await connectDB();
    console.log('🔍 Updating admin user with profileImage field...\n');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@jamsboutique.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }
    
    console.log('✅ Found admin user:', admin.email);
    console.log('Current profileImage:', admin.profileImage);
    
    // Add profileImage field if not exists
    if (!admin.profileImage) {
      admin.profileImage = {
        url: '',
        publicId: ''
      };
      await admin.save();
      console.log('✅ Added profileImage field to admin user');
    } else {
      console.log('✅ profileImage field already exists');
    }
    
    console.log('\n📋 Updated Admin User:');
    console.log('   ID:', admin._id);
    console.log('   Name:', admin.name);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Profile Image:', admin.profileImage);
    
  } catch (error) {
    console.error('❌ Error updating admin:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

updateAdminProfileImage();