const express = require('express');
const router = express.Router();
const passport = require('passport');
const { googleCallback, googleFailure, getCurrentUser, logout, completeSignup, resetPasswordWithGoogle } = require('../Controllers/OAuth');
const { auth } = require('../Middleware/auth');

// Initiate Google OAuth flow
router.get('/google', (req, res, next) => {
    // Get state from query parameter (passed from frontend)
    const state = req.query.state || JSON.stringify({ mode: 'login' });

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
        state: state
    })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, data, info) => {
        if (err) {
            console.error('OAuth error:', err);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
        }

        if (!data) {
            // Handle specific error messages
            const errorMessage = info?.message || 'auth_failed';
            if (errorMessage === 'email_mismatch') {
                return res.redirect(`${process.env.FRONTEND_URL}/signup?error=email_mismatch`);
            }
            if (errorMessage === 'user_exists') {
                return res.redirect(`${process.env.FRONTEND_URL}/signup?error=user_exists`);
            }
            if (errorMessage === 'no_account') {
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_account`);
            }
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }

        // Pass data to callback handler
        req.oauthData = data;
        googleCallback(req, res);
    })(req, res, next);
});

// Complete signup after Google verification
router.post('/complete-signup', completeSignup);

// Reset password after Google verification
router.post('/reset-password-google', resetPasswordWithGoogle);

// OAuth failure route
router.get('/failure', googleFailure);

// Get current authenticated user
router.get('/me', auth, getCurrentUser);

// Logout route
router.post('/logout', logout);

module.exports = router;
