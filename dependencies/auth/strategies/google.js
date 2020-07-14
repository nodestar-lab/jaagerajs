const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = async (passport, config, jr) => {
  passport.use(
    new GoogleStrategy(
      {
        // options for google strategy
        clientID: config.google.oauth2.clientId,
        clientSecret: config.google.oauth2.clientSecret,
        callbackURL: "/google/redirect",
      },
      (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        logger.info(" **** Google authenticating **** ");
        console.log("profile \n", profile);
        jr.DBManager.db.user
          .findOne({
            googleId: profile.id,
          })
          .then((currentUser) => {
            if (currentUser) {
              // already have this user
              console.log("user is: ", currentUser);
              done(null, currentUser);
            } else {
              // if not, create user in our db
              logger.warn("saving google profile info");
              // format and create json token for login and create token
              // inside each json sign token use username and _id
              jr.DBManager.db.user
                .save({
                  googleId: profile.id,
                  username: profile.displayName,
                  thumbnail: profile._json.picture,
                })
                .save()
                .then((newUser) => {
                  console.log("Google login created user : ", newUser);
                  done(null, newUser);
                });
            }
          });
      }
    )
  );
};
