import { body } from 'express-validator';

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['dresses', 'jewelry', 'accessories', 'gifts', 'new-arrivals', 'sale'])
    .withMessage('Invalid category'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  
  body('sizes')
    .optional()
    .isArray().withMessage('Sizes must be an array'),
  
  body('colors')
    .optional()
    .isArray().withMessage('Colors must be an array'),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array')
];

export const validateReview = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  
  body('review')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters')
];