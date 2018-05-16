const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

function authUser(token, done) {
  if (token == 'mytoken')
    return done(null, { login: 'admin' });
  else
    return done(null, false);
};

passport.use(new BearerStrategy(authUser));

module.exports = passport.authenticate('bearer', { session: false });