const passport = require("passport");
const jwt = require("jsonwebtoken");
const _ = require("underscore");
const strategies = require("../dependencies/auth").strategies;

class PassportManager {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*PassportManager]");
  }

  getPassport() {
    return passport;
  }

  async initialize() {
    if (Array.isArray(strategies)) {
      for (let strategy of strategies) {
        await strategy(passport, this.config, this.jr);
      }
    }
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

  signJWT(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.config.secretJWT, this.config.jwt, (e, token) => {
        if (e) {
          return reject(e);
        }
        return resolve(token);
      });
    });
  }
}

module.exports = PassportManager;
