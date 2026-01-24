const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/User');
const Profile = require('../Models/Profile');

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Parse state parameter (contains mode, email, accountType)
        let mode = 'login';
        let expectedEmail = null;
        let accountType = 'Student';

        try {
            const state = JSON.parse(req.query.state || '{}');
            mode = state.mode || 'login';
            expectedEmail = state.email || null;
            accountType = state.accountType || 'Student';
        } catch (e) {
            // If state parsing fails, default to login mode
            mode = 'login';
        }

        const googleEmail = profile.emails[0].value.toLowerCase().trim();
        const validAccountTypes = ['Student', 'Instructor'];
        const finalAccountType = validAccountTypes.includes(accountType) ? accountType : 'Student';

        // MODE: SIGNUP - Just verify email ownership, don't create user
        if (mode === 'signup') {
            // Verify that Google email matches the email from signup form
            if (expectedEmail && googleEmail !== expectedEmail.toLowerCase().trim()) {
                return done(null, false, { message: 'email_mismatch' });
            }

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email: googleEmail }, { googleId: profile.id }]
            });

            if (existingUser) {
                return done(null, false, { message: 'user_exists' });
            }

            // Return verification data (not a full user, just verification info)
            // The frontend will use this to complete signup
            return done(null, {
                verified: true,
                email: googleEmail,
                accountType: finalAccountType,
                googleId: profile.id,
                image: profile.photos[0]?.value,
                firstName: profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User',
                lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || ''
            });
        }

        // MODE: FORGOT_PASSWORD - Just verify email ownership
        if (mode === 'forgot_password') {
            // Verify that Google email matches the email requesting password reset
            if (expectedEmail && googleEmail !== expectedEmail.toLowerCase().trim()) {
                return done(null, false, { message: 'email_mismatch' });
            }

            // Check if user exists
            const user = await User.findOne({ email: googleEmail });

            if (!user) {
                return done(null, false, { message: 'no_account' });
            }

            // Return verification data for password reset
            return done(null, {
                verified: true,
                mode: 'forgot_password',
                email: googleEmail,
                userId: user._id
            });
        }

        // MODE: LOGIN - Standard login flow (for future Google login if needed)
        // Check if user exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        // Check if user exists with the same email
        user = await User.findOne({ email: googleEmail });

        if (user) {
            // Link Google account to existing local account
            user.googleId = profile.id;
            if (!user.image || user.image.includes('dicebear')) {
                user.image = profile.photos[0]?.value || user.image;
            }
            await user.save();
            return done(null, user);
        }

        // For login mode, user must exist
        return done(null, false, { message: 'no_account' });

    } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id || user.email);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
