var session = require("express-session");
var cors = require("cors");
const uuid = require("uuid/v4");
const FileStore = require("session-file-store")(session);
const bodyParser = require("body-parser");

class SessionManager {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*SessionManager] ");
  }

  manageAPI(api, passport) {
    api.use(bodyParser.json());

    api.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    /*  later use it for futher additional origins 
        var corsOptions = {
          origin: '*',
          credentials: true
      }; 
    */
    api.use(cors());

    api.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
    api.use(passport.initialize());

    api.use(function (err, req, res, next) {
      logger.error("*** error handler ***");
      let erorrObj = this.jr.JageeraErrorHandler.handleError(err);
      res.status(erorrObj.code).send({
        error: erorrObj,
      });
    });

    // api.get("/glogin/callback", (req, res) => {
    //   console.log("inside the glogin callback ", res);
    // });
    // api.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    //   res.redirect("http://localhost:4200");
    //   this.jr.MailService.setupTransport(res);
    // });
  }

  setCookie() {}

  getCookie() {}

  removeCookie() {}

  getSessionId() {}
}

module.exports = SessionManager;
