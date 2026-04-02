import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile:', profile);
      
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // User exists, update Google ID if not set
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }
      
      // Create new user - role is always 'customer'
      const hashedPassword = await User.hashPassword(Math.random().toString(36).slice(-8));
      
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: hashedPassword,
        role: 'customer', // Force role to be customer
        googleId: profile.id,
        isEmailVerified: true, // Google emails are verified
        profileImage: {
          url: profile.photos?.[0]?.value || '',
          publicId: ''
        }
      });
      
      return done(null, user);
    } catch (error) {
      console.error('Google auth error:', error);
      return done(error, null);
    }
  }
));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;