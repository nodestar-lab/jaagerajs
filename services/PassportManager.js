const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

class PassportManager {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*PassportManager]");
  }

  getPassport() {
    return passport;
  }

  initialize() {
    passport.use(
      new LocalStrategy(
        {
          usernameField: "username"
        },
        async (username, password, done) => {
          let result = await this.jr.LoginService.findUser({
            username: username,
            password: password
          });
          if (result._id) {
            logger.info(`LocalStrategy loggedIn user : ${result.username}`);
            return done(null, result);
          }
        }
      )
    );

    passport.use(
      new JWTStrategy(
        {
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
          secretOrKey: this.config.secretJWT
        },
        (jwtPayload, cb) => {
          logger.info("**** JWT authenticating **** ");
          return this.jr.DBManager.db.user
            .findOne(jwtPayload.id)
            .then((user) => {
              return cb(null, user);
            })
            .catch((err) => {
              return cb(err);
            });
        }
      )
    );

    passport.use(
      new GoogleStrategy(
        {
          // options for google strategy
          clientID: this.config.google.oauth2.clientId,
          clientSecret: this.config.google.oauth2.clientSecret,
          callbackURL: "/google/redirect"
        },
        (accessToken, refreshToken, profile, done) => {
          // check if user already exists in our own db
          logger.info(" *** Google Strategy *** ");
          console.log("profile \n", profile);
          this.jr.DBManager.db.user
            .findOne({
              googleId: profile.id
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
                this.jr.DBManager.db.user
                  .save({
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.picture
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

    passport.serializeUser((user, done) => {
      logger.warn(
        `--serializeUser  User id is save to the session file store here : ${user.id}`
      );
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      logger.warn(`--deserializeUser user id passport: ${id}`);
      let result = await this.jr.DBManager.db.user.findById(id);
      let user = result._id === id ? result : false;
      done(null, user);
    });
  }

  // for different login strategies use the switch method to login

  authenticate(req, res) {
    passport.authenticate(
      "local",
      {
        session: false
      },
      (err, user, info) => {
        req.login(
          user,
          {
            session: false
          },
          (err) => {
            // logger.warn(
            //     `--authenticate passport : ${JSON.stringify(req.session.passport)}`
            // );
            logger.warn(`--authenticate user : ${JSON.stringify(req.user)}`);
            // logger.warn(`--session id is ${req.sessionID}`);
            const token = jwt.sign(user.toJSON(), this.config.secretJWT, {
              expiresIn: 24 * 60 * 60 // 1 day
            });

            return res.send({
              authenticated: true,
              token: token,
              user: req.user
            });
          }
        );
      }
    )(req, res);
  }
}

module.exports = PassportManager;
