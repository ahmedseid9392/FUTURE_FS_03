import express from 'express';
import { uploadSingle, uploadMultiple } from '../middleware/uploadMiddleware.js';
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage
} from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Profile image upload - accessible by any authenticated user
router.post('/profile', protect, uploadSingle, uploadImage);

// Product images - admin only
router.post('/products', protect, admin, uploadSingle, uploadImage);
router.post('/products/multiple', protect, admin, uploadMultiple, uploadMultipleImages);

// Delete image - admin only
router.delete('/:publicId', protect, admin, deleteImage);

export default router;