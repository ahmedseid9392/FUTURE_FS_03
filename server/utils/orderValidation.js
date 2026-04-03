import { body } from 'express-validator';

export const validateOrder = [
  body('items')
    .isArray().withMessage('Items must be an array')
    .notEmpty().withMessage('Order must have at least one item'),
  
  body('items.*.product')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  
  body('items.*.size')
    .optional()
    .isString().withMessage('Size must be a string'),
  
  body('items.*.color')
    .optional()
    .isString().withMessage('Color must be a string'),
  
  body('shippingAddress')
    .isObject().withMessage('Shipping address is required'),
  
  body('shippingAddress.fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
  
  body('shippingAddress.street')
    .notEmpty().withMessage('Street address is required'),
  
  body('shippingAddress.city')
    .notEmpty().withMessage('City is required'),
  
  body('shippingAddress.state')
    .notEmpty().withMessage('State is required'),
  
  body('shippingAddress.zipCode')
    .notEmpty().withMessage('Zip code is required'),
  
  body('shippingAddress.country')
    .notEmpty().withMessage('Country is required'),
  
  body('shippingAddress.phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('shippingAddress.email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['card', 'cash', 'bank_transfer', 'chapa'])
    .withMessage('Invalid payment method'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

// Add this export - Validation for order status update
export const validateOrderStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid order status'),
  
  body('note')
    .optional()
    .isLength({ max: 500 }).withMessage('Note cannot exceed 500 characters')
];

// Add this export - Validation for payment status update
export const validatePaymentStatus = [
  body('paymentStatus')
    .notEmpty().withMessage('Payment status is required')
    .isIn(['pending', 'processing', 'completed', 'failed', 'refunded'])
    .withMessage('Invalid payment status'),
  
  body('transactionId')
    .optional()
    .isString().withMessage('Transaction ID must be a string')
];