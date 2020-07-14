const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const _ = require("underscore");

module.exports = async (passport, config, jr) => {
  let jwtConfig = Object.assign(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secretJWT,
    },
    config.jwt
  );
  passport.use(
    new JWTStrategy(jwtConfig, (jwtPayload, cb) => {
      logger.info("**** JWT authenticating **** ");
      return jr.DBManager.db.user
        .find({ _id: jwtPayload._id })
        .then((user) => {
          return cb(null, _.omit(user[0]));
        })
        .catch((err) => {
          return cb(err);
        });
    })
  );
};
