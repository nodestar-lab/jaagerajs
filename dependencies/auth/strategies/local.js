const LocalStrategy = require("passport-local").Strategy;
const _ = require("underscore");

module.exports = async (passport, config, jr) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
      },
      async (username, password, done) => {
        logger.info(" **** LOCAL authenticating **** ");
        let result = await jr.LoginService.findUser({
          username: username,
          password: password,
        });
        console.log(" local result is .. ", result);
        if (result._id) {
          console.log(`LocalStrategy loggedIn user : ${result.username}`);
          return done(null, result);
        }
        if (!result._id) {
          console.log(",.....incorrect credentials");
          return done(null, false, { message: "Incorrect credentials." });
        }
      }
    )
  );
};
