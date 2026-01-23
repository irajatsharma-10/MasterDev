const Discussion = require('../Models/Discussion');
const Course = require('../Models/Course');

// Create a new discussion
exports.createDiscussion = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, sectionId, subSectionId, title, content, tags } = req.body;

        if (!courseId || !title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Course ID, title, and content are required'
            });
        }

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user is enrolled or is the instructor
        const isEnrolled = course.studentsEnrolled.some(
            id => id.toString() === userId.toString()
        );
        const isInstructor = course.instructor.toString() === userId.toString();

        if (!isEnrolled && !isInstructor) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled in this course to post discussions'
            });
        }

        // Create discussion
        const discussion = await Discussion.create({
            course: courseId,
            section: sectionId || null,
            subSection: subSectionId || null,
            title,
            content,
            author: userId,
            tags: tags || []
        });

        // Populate author details
        const populatedDiscussion = await Discussion.findById(discussion._id)
            .populate('author', 'firstName lastName image accountType');

        return res.status(201).json({
            success: true,
            message: 'Discussion created successfully',
            data: populatedDiscussion
        });
    } catch (error) {
        console.error('Create discussion error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create discussion',
            error: error.message
        });
    }
};

// Get discussions for a course
exports.getDiscussions = async (req, res) => {
    try {
        const {
            courseId,
            sectionId,
            subSectionId,
            page = 1,
            limit = 20,
            sortBy = 'recent',
            search
        } = req.query;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        // Build filter
        const filter = { course: courseId };
        if (sectionId) filter.section = sectionId;
        if (subSectionId) filter.subSection = subSectionId;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Sort options
        const sortOptions = {
            recent: { createdAt: -1 },
            popular: { upvotes: -1, createdAt: -1 },
            unanswered: { 'replies.0': { $exists: false }, createdAt: -1 }
        };

        const skip = (Number(page) - 1) * Number(limit);

        const discussions = await Discussion.find(filter)
            .populate('author', 'firstName lastName image accountType')
            .sort(sortOptions[sortBy] || sortOptions.recent)
            .skip(skip)
            .limit(Number(limit));

        const total = await Discussion.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: discussions,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalDiscussions: total
            }
        });
    } catch (error) {
        console.error('Get discussions error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch discussions',
            error: error.message
        });
    }
};

// Get single discussion with replies
exports.getDiscussion = async (req, res) => {
    try {
        const { discussionId } = req.params;

        const discussion = await Discussion.findByIdAndUpdate(
            discussionId,
            { $inc: { views: 1 } },
            { new: true }
        )
            .populate('author', 'firstName lastName image accountType')
            .populate('replies.author', 'firstName lastName image accountType');

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: discussion
        });
    } catch (error) {
        console.error('Get discussion error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch discussion',
            error: error.message
        });
    }
};

// Add reply to discussion
exports.addReply = async (req, res) => {
    try {
        const userId = req.user.id;
        const { discussionId, content } = req.body;

        if (!discussionId || !content) {
            return res.status(400).json({
                success: false,
                message: 'Discussion ID and content are required'
            });
        }

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        // Check if user is instructor of the course
        const course = await Course.findById(discussion.course);
        const isInstructor = course.instructor.toString() === userId.toString();

        // Add reply
        discussion.replies.push({
            content,
            author: userId,
            isInstructorReply: isInstructor
        });

        await discussion.save();

        // Return updated discussion with populated replies
        const updatedDiscussion = await Discussion.findById(discussionId)
            .populate('author', 'firstName lastName image accountType')
            .populate('replies.author', 'firstName lastName image accountType');

        return res.status(200).json({
            success: true,
            message: 'Reply added successfully',
            data: updatedDiscussion
        });
    } catch (error) {
        console.error('Add reply error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add reply',
            error: error.message
        });
    }
};

// Upvote discussion or reply
exports.toggleUpvote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { discussionId, replyId } = req.body;

        if (!discussionId) {
            return res.status(400).json({
                success: false,
                message: 'Discussion ID is required'
            });
        }

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        if (replyId) {
            // Upvote reply
            const reply = discussion.replies.id(replyId);
            if (!reply) {
                return res.status(404).json({
                    success: false,
                    message: 'Reply not found'
                });
            }

            const upvoteIndex = reply.upvotes.indexOf(userId);
            if (upvoteIndex > -1) {
                reply.upvotes.splice(upvoteIndex, 1);
            } else {
                reply.upvotes.push(userId);
            }
        } else {
            // Upvote discussion
            const upvoteIndex = discussion.upvotes.indexOf(userId);
            if (upvoteIndex > -1) {
                discussion.upvotes.splice(upvoteIndex, 1);
            } else {
                discussion.upvotes.push(userId);
            }
        }

        await discussion.save();

        return res.status(200).json({
            success: true,
            message: 'Upvote toggled successfully',
            data: discussion
        });
    } catch (error) {
        console.error('Toggle upvote error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to toggle upvote',
            error: error.message
        });
    }
};

// Mark discussion as resolved
exports.markAsResolved = async (req, res) => {
    try {
        const userId = req.user.id;
        const { discussionId, replyId } = req.body;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        // Check if user is the author or instructor
        const course = await Course.findById(discussion.course);
        const isAuthor = discussion.author.toString() === userId.toString();
        const isInstructor = course.instructor.toString() === userId.toString();

        if (!isAuthor && !isInstructor) {
            return res.status(403).json({
                success: false,
                message: 'Only the author or instructor can mark as resolved'
            });
        }

        discussion.isResolved = true;

        // Mark specific reply as accepted answer
        if (replyId) {
            const reply = discussion.replies.id(replyId);
            if (reply) {
                // Unmark any previously accepted answers
                discussion.replies.forEach(r => {
                    r.isAcceptedAnswer = false;
                });
                reply.isAcceptedAnswer = true;
            }
        }

        await discussion.save();

        return res.status(200).json({
            success: true,
            message: 'Discussion marked as resolved',
            data: discussion
        });
    } catch (error) {
        console.error('Mark as resolved error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to mark as resolved',
            error: error.message
        });
    }
};

// Delete discussion (author or instructor only)
exports.deleteDiscussion = async (req, res) => {
    try {
        const userId = req.user.id;
        const { discussionId } = req.body;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        // Check authorization
        const course = await Course.findById(discussion.course);
        const isAuthor = discussion.author.toString() === userId.toString();
        const isInstructor = course.instructor.toString() === userId.toString();

        if (!isAuthor && !isInstructor) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this discussion'
            });
        }

        await Discussion.findByIdAndDelete(discussionId);

        return res.status(200).json({
            success: true,
            message: 'Discussion deleted successfully'
        });
    } catch (error) {
        console.error('Delete discussion error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete discussion',
            error: error.message
        });
    }
};
