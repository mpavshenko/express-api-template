const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

function authUser(token, done) {
  if (token)
    return done(null, { userId: token });
  else
    return done(null, false);
};

passport.use(new BearerStrategy(authUser));

module.exports = passport.authenticate('bearer', { session: false });