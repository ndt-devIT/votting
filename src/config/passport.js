const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NguoiDung = require('../models/NguoiDung');
const dotenv = require('dotenv');

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm user theo googleId
        let user = await NguoiDung.findOne({ googleId: profile.id });

        if (!user) {
          // Nếu chưa có, tạo mới
          user = new NguoiDung({
            googleId: profile.id,
            hoTen: profile.displayName,
            email: profile.emails[0].value,
            role: 'user'
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Optional: serialize / deserialize (dùng nếu dùng session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await NguoiDung.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
