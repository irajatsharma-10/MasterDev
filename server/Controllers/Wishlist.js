const Wishlist = require('../Models/Wishlist');
const Course = require('../Models/Course');

// Add course to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
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

        // Check if user is already enrolled
        const isEnrolled = course.studentsEnrolled.some(
            id => id.toString() === userId.toString()
        );
        if (isEnrolled) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course'
            });
        }

        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userId,
                courses: [courseId]
            });
        } else {
            // Check if course already in wishlist
            if (wishlist.courses.includes(courseId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Course already in wishlist'
                });
            }
            wishlist.courses.push(courseId);
            await wishlist.save();
        }

        // Populate and return
        const populatedWishlist = await Wishlist.findById(wishlist._id)
            .populate({
                path: 'courses',
                select: 'courseName thumbnail price instructor',
                populate: {
                    path: 'instructor',
                    select: 'firstName lastName'
                }
            });

        return res.status(200).json({
            success: true,
            message: 'Course added to wishlist',
            data: populatedWishlist.courses
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add course to wishlist',
            error: error.message
        });
    }
};

// Remove course from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId },
            { $pull: { courses: courseId } },
            { new: true }
        ).populate({
            path: 'courses',
            select: 'courseName thumbnail price instructor',
            populate: {
                path: 'instructor',
                select: 'firstName lastName'
            }
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Course removed from wishlist',
            data: wishlist.courses
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to remove course from wishlist',
            error: error.message
        });
    }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ user: userId })
            .populate({
                path: 'courses',
                select: 'courseName courseDescription thumbnail price instructor ratingAndReviews studentsEnrolled',
                populate: [
                    {
                        path: 'instructor',
                        select: 'firstName lastName image'
                    },
                    {
                        path: 'ratingAndReviews',
                        select: 'rating'
                    }
                ]
            });

        // Calculate average rating for each course
        let courses = [];
        if (wishlist && wishlist.courses) {
            courses = wishlist.courses.map(course => {
                const courseObj = course.toObject();
                if (courseObj.ratingAndReviews && courseObj.ratingAndReviews.length > 0) {
                    const totalRating = courseObj.ratingAndReviews.reduce((sum, r) => sum + r.rating, 0);
                    courseObj.averageRating = totalRating / courseObj.ratingAndReviews.length;
                } else {
                    courseObj.averageRating = 0;
                }
                courseObj.reviewCount = courseObj.ratingAndReviews ? courseObj.ratingAndReviews.length : 0;
                courseObj.studentCount = courseObj.studentsEnrolled ? courseObj.studentsEnrolled.length : 0;
                return courseObj;
            });
        }

        return res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch wishlist',
            error: error.message
        });
    }
};

// Check if course is in wishlist
exports.isInWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;

        const wishlist = await Wishlist.findOne({
            user: userId,
            courses: courseId
        });

        return res.status(200).json({
            success: true,
            isInWishlist: !!wishlist
        });
    } catch (error) {
        console.error('Check wishlist error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check wishlist',
            error: error.message
        });
    }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        await Wishlist.findOneAndUpdate(
            { user: userId },
            { courses: [] }
        );

        return res.status(200).json({
            success: true,
            message: 'Wishlist cleared'
        });
    } catch (error) {
        console.error('Clear wishlist error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to clear wishlist',
            error: error.message
        });
    }
};
