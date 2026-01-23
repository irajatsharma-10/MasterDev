const express = require('express');
const router = express.Router();

const { login, signUp, sendOTP, changePassword } = require('../Controllers/Auth');
const { resetPassword, resetPasswordToken } = require('../Controllers/ResetPassword');
const { auth } = require('../Middleware/auth');
const {
    validateLogin,
    validateSignup,
    validateOTP,
    validateResetRequest,
    validateResetPassword,
    validateChangePassword
} = require('../Middleware/validation');

// Authentication routes
router.post('/login', validateLogin, login);
router.post('/signup', validateSignup, signUp);
router.post('/sendotp', validateOTP, sendOTP);
router.post('/changepassword', auth, validateChangePassword, changePassword);

// Password reset routes
router.post('/reset-password-token', validateResetRequest, resetPasswordToken);
router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;

