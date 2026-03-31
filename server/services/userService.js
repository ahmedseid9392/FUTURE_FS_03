import User from '../models/User.js';

/**
 * User Service - Handles all user-related business logic
 */
class UserService {
  /**
   * Create a new user with hashed password
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} - Created user object
   */
  static async createUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.emailExists(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Hash password before creating
      const hashedPassword = await User.hashPassword(userData.password);
      
      // Create new user with hashed password
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      return user.getPublicProfile();
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Find user by email with password (for authentication)
   * @param {string} email - User email
   * @returns {Promise<Object>} - User object with password
   */
  static async findUserByEmailWithPassword(email) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update user password
   * @param {string} userId - User ID
   * @param {string} newPassword - New password (plain text)
   * @returns {Promise<boolean>} - Success status
   */
  static async updatePassword(userId, newPassword) {
    try {
      // Hash the new password
      const hashedPassword = await User.hashPassword(newPassword);
      
      // Update user with hashed password
      const user = await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true, runValidators: true }
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User object
   */
  static async findUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user.getPublicProfile();
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated user object
   */
  static async updateUserProfile(userId, updateData) {
    try {
      // Remove sensitive fields
      delete updateData.password;
      delete updateData.email;
      delete updateData.role;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user.getPublicProfile();
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} - Success status
   */
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user with password
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }
      
      // Hash new password and update
      const hashedPassword = await User.hashPassword(newPassword);
      user.password = hashedPassword;
      await user.save();
      
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get all users (admin only)
   * @param {Object} filters - Filter criteria
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} - List of users
   */
  static async getAllUsers(filters = {}, pagination = { page: 1, limit: 10 }) {
    try {
      const query = {};
      
      if (filters.role) query.role = filters.role;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
      if (filters.search) {
        query.$text = { $search: filters.search };
      }
      
      const page = parseInt(pagination.page) || 1;
      const limit = parseInt(pagination.limit) || 10;
      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        User.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .select('-password -__v'),
        User.countDocuments(query)
      ]);
      
      return {
        users: users.map(user => user.getPublicProfile()),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Delete user (soft delete)
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update last login timestamp
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  static async updateLastLogin(userId) {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
  }
}

export default UserService;