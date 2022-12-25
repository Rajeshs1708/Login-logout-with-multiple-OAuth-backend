const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const GOOGLE_CLIENT_ID        = "946149001874-vbkhl33mrjloffvhj60hl7uetmgl1n7q.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET    = "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"
const GOOGLE_CALLBACK_URL     = "/auth/google/callback"

const GITHUB_CLIENT_ID        = "14f0d5998bc2936f3c1b"
const GITHUB_CLIENT_SECRET    = "ba7dc23142e6874aaa69379afb1807ca5576708c"
const GITHUB_CALLBACK_URL     = "https://login-and-logout-with-multiple-oauth.onrender.com/auth/github/callback"

const FACEBOOK_APP_ID         = "1f0d5998bc2936f3"
const FACEBOOK_APP_SECRET     = "23142e6874aaa69379afb1807c"
const FACEBOOK_CALLBACK_URL   = "https://login-and-logout-with-multiple-oauth.onrender.com/auth/facebook/callback"

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

// Google
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
  // passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile)
  }
));

// Github
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: GITHUB_CALLBACK_URL,
  passReqToCallback: true

},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Facebook
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: FACEBOOK_CALLBACK_URL,
  passReqToCallback: true

},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));
