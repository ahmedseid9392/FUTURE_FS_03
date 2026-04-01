import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const addProfileImageToAllUsers = async () => {
  try {
    await connectDB();
    console.log('🔍 Adding profileImage field to all users...\n');
    
    // Find all users without profileImage
    const usersWithoutImage = await User.find({ profileImage: { $exists: false } });
    
    console.log(`Found ${usersWithoutImage.length} users without profileImage field\n`);
    
    let updatedCount = 0;
    
    for (const user of usersWithoutImage) {
      user.profileImage = {
        url: '',
        publicId: ''
      };
      await user.save();
      updatedCount++;
      console.log(`✅ Updated user: ${user.email}`);
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} users with profileImage field`);
    
    // Verify all users now have profileImage
    const totalUsers = await User.countDocuments();
    const usersWithImage = await User.countDocuments({ profileImage: { $exists: true } });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Users with profileImage: ${usersWithImage}`);
    console.log(`   Users without profileImage: ${totalUsers - usersWithImage}`);
    
  } catch (error) {
    console.error('❌ Error updating users:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

addProfileImageToAllUsers();