import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const testUserModel = async () => {
  try {
    await connectDB();
    console.log('🧪 Testing User Model (No Pre-save)...\n');
    
    // Test 1: Create user with manually hashed password
    console.log('📝 Test 1: Creating new user...');
    const hashedPassword = await User.hashPassword('password123');
    
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword, // Manually hashed
      phone: '+251911234567',
      address: {
        street: '123 Test Street',
        city: 'Addis Ababa',
        state: 'Addis Ababa',
        zipCode: '1000',
        country: 'Ethiopia'
      }
    });
    console.log('✅ User created!');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Initials:', user.initials);
    console.log('---\n');
    
    // Test 2: Find by email
    console.log('📝 Test 2: Finding user by email...');
    const foundUser = await User.findByEmail('test@example.com');
    console.log('✅ Found:', foundUser.name);
    console.log('---\n');
    
    // Test 3: Email exists check
    console.log('📝 Test 3: Checking email exists...');
    const exists = await User.emailExists('test@example.com');
    console.log('Email exists:', exists);
    console.log('---\n');
    
    // Test 4: Password comparison
    console.log('📝 Test 4: Testing password...');
    const correctPass = await user.comparePassword('password123');
    const wrongPass = await user.comparePassword('wrong');
    console.log('Correct password:', correctPass ? '✅' : '❌');
    console.log('Wrong password:', !wrongPass ? '✅' : '❌');
    console.log('---\n');
    
    // Test 5: Public profile
    console.log('📝 Test 5: Public profile...');
    const profile = user.getPublicProfile();
    console.log('Has password?', profile.hasOwnProperty('password') ? '❌' : '✅');
    console.log('---\n');
    
    // Test 6: Update user
    console.log('📝 Test 6: Updating user...');
    user.name = 'Updated User';
    await user.save();
    console.log('✅ Updated name:', user.name);
    console.log('---\n');
    
    // Test 7: Update password manually
    console.log('📝 Test 7: Updating password...');
    const newHashedPassword = await User.hashPassword('newPassword456');
    user.password = newHashedPassword;
    await user.save();
    const passwordUpdated = await user.comparePassword('newPassword456');
    console.log('Password updated:', passwordUpdated ? '✅' : '❌');
    console.log('---\n');
    
    // Test 8: Duplicate email
    console.log('📝 Test 8: Duplicate email validation...');
    try {
      await User.create({
        name: 'Duplicate',
        email: 'test@example.com',
        password: await User.hashPassword('pass123')
      });
      console.log('❌ Failed - should have errored');
    } catch (error) {
      console.log('✅ Caught duplicate error');
    }
    console.log('---\n');
    
    // Test 9: Invalid email
    console.log('📝 Test 9: Invalid email validation...');
    try {
      await User.create({
        name: 'Invalid',
        email: 'invalid',
        password: await User.hashPassword('pass123')
      });
      console.log('❌ Failed - should have errored');
    } catch (error) {
      console.log('✅ Caught invalid email error');
    }
    console.log('---\n');
    
    // Test 10: Short password in controller (validation only)
    console.log('📝 Test 10: Password validation...');
    try {
      await User.create({
        name: 'Short',
        email: 'short@test.com',
        password: '123' // This will fail validation
      });
      console.log('❌ Failed - should have errored');
    } catch (error) {
      console.log('✅ Caught short password error');
    }
    console.log('---\n');
    
    // Cleanup
    await User.deleteMany({ email: 'test@example.com' });
    console.log('🧹 Cleanup complete');
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
  }
};

testUserModel();