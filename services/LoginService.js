const _ = require("underscore");

class LoginService {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*LoginService] ");
  }

  initialize() {}

  async handleLogin(req, res) {
    if (!req.user) {
      res.send({ authenticated: false });
      return;
    }
    this.jr.PassportManager.signJWT(_.pick(req.user, "_id", "username")).then(
      (token) => {
        res.send({
          token,
          authenticated: true,
          user: _.omit(req.user, "password"),
        });
      }
    );
  }

  async findUser(data) {
    let result = await this.jr.DBManager.db.user.find(data);
    if (result && result.length > 0) {
      return result[0];
    } else {
      return {
        message: "Login details are wrong",
        authenticated: false,
      };
    }
  }

  handleLogout(req, res) {
    req.logout();
    res.send({
      logout: true,
    });
  }
}

module.exports = LoginService;
