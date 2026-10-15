const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value.toLowerCase();
      
      // Check if user exists by email
      let user = await User.findOne({ email });
      
      if (user) {
        // If user exists but doesn't have Google ID, link it
        if (!user.googleId) {
          user.googleId = profile.id;
          user.authProvider = 'google';
          await user.save();
        }
        
        return done(null, user);
      }
      
      // Create new user with Google profile
      user = await User.create({
        fullName: profile.displayName || profile.name.givenName + ' ' + profile.name.familyName,
        email: email,
        googleId: profile.id,
        authProvider: 'google',
        phone: '', // Will need to be provided later
        flatNumber: '', // Will need to be provided later
        role: 'Resident',
        isActive: true,
        profileImage: profile.photos[0]?.value || ''
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

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