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
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // User exists with Google ID, return user
            return done(null, user);
        }

        // Check if user exists with the same email (registered locally)
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // Link Google account to existing local account
            user.googleId = profile.id;
            if (!user.image || user.image.includes('dicebear')) {
                user.image = profile.photos[0]?.value || user.image;
            }
            await user.save();
            return done(null, user);
        }

        // Create new user
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const newUser = await User.create({
            firstName: profile.name.givenName || profile.displayName.split(' ')[0],
            lastName: profile.name.familyName || profile.displayName.split(' ').slice(1).join(' ') || '',
            email: profile.emails[0].value,
            password: null, // OAuth users don't need password
            accountType: 'Student', // Default to Student, can change later
            additionalDetails: profileDetails._id,
            image: profile.photos[0]?.value || `https://api.dicebear.com/5.x/initials/svg?seed=${profile.name.givenName}`,
            googleId: profile.id,
            authProvider: 'google',
            courses: [],
            courseProgress: [],
        });

        return done(null, newUser);

    } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, null);
    }
}));

// Serialize user for session (we're not using sessions, but passport requires this)
passport.serializeUser((user, done) => {
    done(null, user._id);
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
