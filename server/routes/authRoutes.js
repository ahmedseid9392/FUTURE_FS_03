import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
} from '../utils/userValidation.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// Public routes
console.log('Setting up auth routes...');
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/change-password', protect, validatePasswordChange, changePassword);

// Admin routes
router.get('/users', protect, admin, getAllUsers);

console.log('✅ Auth routes configured');

export default router;