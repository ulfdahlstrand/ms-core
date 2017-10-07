var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: process.env.JWT_SECRET || 'React Starter Kit',
};
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

    let profile = jwt_payload;
    var username = profile.email.split("@")[0];

    var user = {
      id: profile.id,
      email: profile.email,
      username: username,
      name: {
        firstname: profile.name.firstname,
        lastname: profile.name.lastname,
      },
      profile: profile
    };

    if (user.email) {
        done(null, user);
    } else {
        done(null, false);
    }
}));

module.exports = passport;
