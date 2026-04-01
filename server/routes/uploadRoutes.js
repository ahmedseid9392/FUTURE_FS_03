import express from 'express';
import { uploadSingle, uploadMultiple } from '../middleware/uploadMiddleware.js';
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage
} from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (admin only)
router.post('/', protect, admin, uploadSingle, uploadImage);
router.post('/multiple', protect, admin, uploadMultiple, uploadMultipleImages);
router.delete('/:publicId', protect, admin, deleteImage);

export default router;