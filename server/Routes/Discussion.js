const express = require('express');
const router = express.Router();
const {
    createDiscussion,
    getDiscussions,
    getDiscussion,
    addReply,
    toggleUpvote,
    markAsResolved,
    deleteDiscussion
} = require('../Controllers/Discussion');
const { auth } = require('../Middleware/auth');

// Public routes (still need auth to verify enrollment)
router.get('/', auth, getDiscussions);
router.get('/:discussionId', auth, getDiscussion);

// Protected routes
router.post('/create', auth, createDiscussion);
router.post('/reply', auth, addReply);
router.post('/upvote', auth, toggleUpvote);
router.post('/resolve', auth, markAsResolved);
router.delete('/delete', auth, deleteDiscussion);

module.exports = router;
