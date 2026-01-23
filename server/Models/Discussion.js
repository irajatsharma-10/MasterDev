const mongoose = require('mongoose');

// Reply Schema (embedded in Discussion)
const ReplySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isInstructorReply: {
        type: Boolean,
        default: false
    },
    isAcceptedAnswer: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Discussion Schema
const DiscussionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
    },
    subSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subsection'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    replies: [ReplySchema],
    tags: [{
        type: String,
        trim: true
    }],
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isResolved: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Indexes for efficient queries
DiscussionSchema.index({ course: 1, createdAt: -1 });
DiscussionSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Discussion', DiscussionSchema);
