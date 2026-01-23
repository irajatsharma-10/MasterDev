const express = require('express');
const router = express.Router();
const {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    isInWishlist,
    clearWishlist
} = require('../Controllers/Wishlist');
const { auth } = require('../Middleware/auth');

// All wishlist routes require authentication
router.post('/add', auth, addToWishlist);
router.post('/remove', auth, removeFromWishlist);
router.get('/', auth, getWishlist);
router.get('/check/:courseId', auth, isInWishlist);
router.delete('/clear', auth, clearWishlist);

module.exports = router;
