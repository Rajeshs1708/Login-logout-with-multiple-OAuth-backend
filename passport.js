const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

// Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://login-logout-with-multiple-o-auth-backend.vercel.app/auth/google/callback",
},
  function (request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    return done(null, profile)
  }
));

// Github
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "https://login-logout-with-multiple-o-auth-backend.vercel.app/auth/github/callback",
},
  function (request, accessToken, refreshToken, profile, done) {
    
    return done(null, profile);
  }
));

// Facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "https://login-logout-with-multiple-o-auth-backend.vercel.app/auth/facebook/callback",
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));
