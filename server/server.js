import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes - MUST be before error handlers
console.log('📌 Registering routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes registered at /api/auth');

app.use('/api/products', productRoutes);
console.log('✅ Product routes registered at /api/products');

app.use('/api/orders', orderRoutes);
console.log('✅ Order routes registered at /api/orders');


// 404 handler - This should be AFTER all routes
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
  console.log(`📦 Using ES Module syntax\n`);
  
  // Log all registered routes
  console.log('📋 Registered Routes:');
 
  console.log('  POST   /api/auth/register');
  console.log('  POST   /api/auth/login');
  console.log('  GET    /api/auth/profile');
  console.log('  PUT    /api/auth/profile');
  console.log('  PUT    /api/auth/change-password');
  console.log('  GET    /api/auth/users (admin)\n');

  console.log('  GET    /api/products');
console.log('  GET    /api/products/featured');
console.log('  GET    /api/products/categories/all');
console.log('  GET    /api/products/category/:category');
console.log('  GET    /api/products/:id');
console.log('  POST   /api/products (admin)');
console.log('  PUT    /api/products/:id (admin)');
console.log('  DELETE /api/products/:id (admin)');
console.log('  POST   /api/products/:id/reviews');
});

export default app;