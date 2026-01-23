const express = require('express');
const router = express.Router();
const passport = require('passport');
const { googleCallback, googleFailure, getCurrentUser, logout } = require('../Controllers/OAuth');
const { auth } = require('../Middleware/auth');

// Initiate Google OAuth flow
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/api/v1/oauth/failure'
    }),
    googleCallback
);

// OAuth failure route
router.get('/failure', googleFailure);

// Get current authenticated user
router.get('/me', auth, getCurrentUser);

// Logout route
router.post('/logout', logout);

module.exports = router;
