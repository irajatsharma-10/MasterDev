const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// Handle Google OAuth callback
exports.googleCallback = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Set secure cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/'
        };

        // Set the token cookie
        res.cookie('token', token, cookieOptions);

        // Redirect to frontend dashboard
        res.redirect(`${process.env.FRONTEND_URL}/dashboard/my-profile`);

    } catch (error) {
        console.error('OAuth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
};

// Handle OAuth failure
exports.googleFailure = (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
};

// Get current user (for checking auth status)
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -token -resetPasswordExpires')
            .populate('additionalDetails')
            .populate('courses')
            .populate('courseProgress');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get user data'
        });
    }
};

// Logout user
exports.logout = (req, res) => {
    try {
        // Clear the token cookie
        res.cookie('token', '', {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/'
        });

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};
