import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
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

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
    session: true
  }),
  (req, res) => {
    // Generate JWT token for the user
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user.getPublicProfile()))}`);
  }
);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/change-password', protect, validatePasswordChange, changePassword);

// Admin routes
router.get('/users', protect, admin, getAllUsers);

export default router;