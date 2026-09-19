const { validationResult, body } = require('express-validator');

/**
 * Middleware that inspects express-validator results
 * Returns 400 with standard error schema if validation fails
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Allowed transaction categories
const ALLOWED_CATEGORIES = [
  'Salary',
  'Freelance',
  'Gift',
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Entertainment',
  'Education',
  'Health',
  'Other',
];

// Validation rules for User Registration
const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Validation rules for User Login
const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation rules for Creating a Transaction
const createTransactionValidationRules = [
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Transaction type is required')
    .toLowerCase()
    .isIn(['income', 'expense'])
    .withMessage('Transaction type must be either income or expense'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a number greater than 0'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(ALLOWED_CATEGORIES)
    .withMessage('Please select a valid transaction category'),
  body('date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Date must be a valid ISO date format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
];

// Validation rules for Updating a Transaction
const updateTransactionValidationRules = [
  body('type')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['income', 'expense'])
    .withMessage('Transaction type must be either income or expense'),
  body('amount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a number greater than 0'),
  body('category')
    .optional()
    .trim()
    .isIn(ALLOWED_CATEGORIES)
    .withMessage('Please select a valid transaction category'),
  body('date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Date must be a valid ISO date format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
];

module.exports = {
  validate,
  registerValidationRules,
  loginValidationRules,
  createTransactionValidationRules,
  updateTransactionValidationRules,
};
