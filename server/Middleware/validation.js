const { body, validationResult } = require('express-validator');

// Helper to handle validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Login validation
exports.validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

// Signup validation
exports.validateSignup = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain letters')
        .escape(),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Last name can only contain letters')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    body('confirmPassword')
        .notEmpty().withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    body('accountType')
        .notEmpty().withMessage('Account type is required')
        .isIn(['Student', 'Instructor']).withMessage('Account type must be Student or Instructor'),
    handleValidationErrors
];

// OTP validation
exports.validateOTP = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    handleValidationErrors
];

// Password reset request validation
exports.validateResetRequest = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    handleValidationErrors
];

// Password reset validation
exports.validateResetPassword = [
    body('token')
        .notEmpty().withMessage('Reset token is required'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    body('confirmPassword')
        .notEmpty().withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    handleValidationErrors
];

// Change password validation
exports.validateChangePassword = [
    body('oldPassword')
        .notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    body('confirmNewPassword')
        .notEmpty().withMessage('Please confirm your new password')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    handleValidationErrors
];

// Course creation validation
exports.validateCourse = [
    body('courseName')
        .trim()
        .notEmpty().withMessage('Course name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Course name must be 3-100 characters'),
    body('courseDescription')
        .trim()
        .notEmpty().withMessage('Course description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number')
        .custom(value => value >= 0).withMessage('Price cannot be negative'),
    body('category')
        .notEmpty().withMessage('Category is required'),
    handleValidationErrors
];

// Rating validation
exports.validateRating = [
    body('courseId')
        .notEmpty().withMessage('Course ID is required')
        .isMongoId().withMessage('Invalid course ID'),
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review')
        .trim()
        .notEmpty().withMessage('Review is required')
        .isLength({ min: 10, max: 500 }).withMessage('Review must be 10-500 characters'),
    handleValidationErrors
];

// Contact form validation
exports.validateContact = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .escape(),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Message must be 10-1000 characters')
        .escape(),
    handleValidationErrors
];
