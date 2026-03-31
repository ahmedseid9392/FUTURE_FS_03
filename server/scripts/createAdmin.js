import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();
    console.log('🔍 Checking for existing admin...\n');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@jamsboutique.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('Email: admin@jamsboutique.com');
      console.log('Password: Admin@123');
      await mongoose.connection.close();
      return;
    }
    
    // Hash password
    const hashedPassword = await User.hashPassword('Admin@123');
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@jamsboutique.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+251911000000',
      address: {
        street: 'Admin Street',
        city: 'Addis Ababa',
        state: 'Addis Ababa',
        zipCode: '1000',
        country: 'Ethiopia'
      },
      isActive: true,
      isEmailVerified: true
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@jamsboutique.com');
    console.log('   Password: Admin@123');
    console.log('\n⚠️  Please change this password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

createAdmin();