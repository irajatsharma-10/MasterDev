const User = require("../Models/User");
const mailSender = require('../Utils/mailsender');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


// resetPasswordToken - Request password reset email
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide your email address'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address'
            });
        }

        // Check if user signed up with OAuth
        if (user.authProvider === 'google') {
            return res.status(400).json({
                success: false,
                message: 'This account uses Google sign-in. Please login with Google.'
            });
        }

        // Generate secure reset token
        const token = crypto.randomBytes(32).toString("hex");

        // Update user with token and 1-hour expiry
        await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000 // 1 hour
            },
            { new: true }
        );

        // Create reset URL using environment variable
        const resetUrl = `${process.env.FRONTEND_URL}/update-password/${token}`;

        // Send reset email
        await mailSender(
            email,
            "MasterDev - Password Reset Request",
            `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset for your MasterDev account.</p>
            <p>Click the link below to reset your password (valid for 1 hour):</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #FFD60A; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>MasterDev Team</p>
            `
        );

        return res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (error) {
        console.error("Reset password token error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send reset email. Please try again later."
        });
    }
}

// resetPassword - Reset password using token
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        // Validate inputs
        if (!password || !confirmPassword || !token) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Find user by token
        const userDetails = await User.findOne({ token: token });

        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired reset link. Please request a new one.'
            });
        }

        // Check token expiry
        if (userDetails.resetPasswordExpires < Date.now()) {
            // Clear expired token
            await User.findOneAndUpdate(
                { token: token },
                { token: null, resetPasswordExpires: null }
            );
            return res.status(401).json({
                success: false,
                message: "Reset link has expired. Please request a new one."
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and clear reset token
        await User.findOneAndUpdate(
            { token: token },
            {
                password: hashedPassword,
                token: null,
                resetPasswordExpires: null
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successful. You can now login with your new password."
        });

    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reset password. Please try again later."
        });
    }
}