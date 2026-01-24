const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const Profile = require('../Models/Profile');

// Handle Google OAuth callback
exports.googleCallback = async (req, res) => {
    try {
        const data = req.oauthData;

        if (!data) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }

        // Check if this is a verification response (signup or forgot_password mode)
        if (data.verified) {
            if (data.mode === 'forgot_password') {
                // Redirect to password reset page with verification token
                const resetToken = jwt.sign(
                    { userId: data.userId, email: data.email, purpose: 'password_reset' },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                );
                return res.redirect(`${process.env.FRONTEND_URL}/update-password?token=${resetToken}`);
            }

            // Signup verification - redirect to complete signup
            const verificationToken = jwt.sign(
                {
                    email: data.email,
                    googleId: data.googleId,
                    accountType: data.accountType,
                    image: data.image,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    purpose: 'signup_verification'
                },
                process.env.JWT_SECRET,
                { expiresIn: '10m' }
            );
            return res.redirect(`${process.env.FRONTEND_URL}/complete-signup?token=${verificationToken}`);
        }

        // Regular login - user object returned
        const user = data;

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

// Complete signup after Google email verification
exports.completeSignup = async (req, res) => {
    try {
        const { token, password, firstName, lastName, accountType } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Token and password are required'
            });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired verification token. Please try signing up again.'
            });
        }

        if (decoded.purpose !== 'signup_verification') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token purpose'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email: decoded.email }, { googleId: decoded.googleId }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists. Please login instead.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // Use provided names or fall back to Google profile data
        const finalFirstName = firstName || decoded.firstName || 'User';
        const finalLastName = lastName || decoded.lastName || finalFirstName;
        const finalAccountType = accountType || decoded.accountType || 'Student';

        // Create user
        const newUser = await User.create({
            firstName: finalFirstName,
            lastName: finalLastName,
            email: decoded.email,
            password: hashedPassword,
            accountType: finalAccountType,
            additionalDetails: profileDetails._id,
            image: decoded.image || `https://api.dicebear.com/5.x/initials/svg?seed=${finalFirstName}`,
            googleId: decoded.googleId,
            authProvider: 'google',
            courses: [],
            courseProgress: [],
        });

        // Generate JWT token
        const authToken = jwt.sign(
            {
                email: newUser.email,
                id: newUser._id,
                accountType: newUser.accountType
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Prepare user data
        const userData = {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            accountType: newUser.accountType,
            image: newUser.image,
            additionalDetails: newUser.additionalDetails,
            courses: newUser.courses,
            courseProgress: newUser.courseProgress,
        };

        return res.status(200).json({
            success: true,
            message: 'Account created successfully',
            token: authToken,
            user: userData
        });

    } catch (error) {
        console.error('Complete signup error:', error);

        // Handle duplicate key error (user already exists)
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern || {})[0];
            if (duplicateField === 'googleId') {
                return res.status(400).json({
                    success: false,
                    message: 'This Google account is already linked to an existing account. Please login instead.'
                });
            }
            if (duplicateField === 'email') {
                return res.status(400).json({
                    success: false,
                    message: 'An account with this email already exists. Please login instead.'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Account already exists. Please login instead.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to complete signup. Please try again.'
        });
    }
};

// Reset password after Google verification
exports.resetPasswordWithGoogle = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            });
        }

        // Check password complexity
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        if (!hasUppercase || !hasLowercase || !hasNumber) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain uppercase, lowercase, and a number'
            });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired reset token. Please verify your identity again.'
            });
        }

        if (decoded.purpose !== 'password_reset') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token purpose'
            });
        }

        // Find user
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to reset password. Please try again.'
        });
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
