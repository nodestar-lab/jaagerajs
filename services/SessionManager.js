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
    /* later use it for futher additional origins 
            var corsOptions = {
                origin: '*',
                credentials: true
            }; 
            */
    api.use(cors());

    api.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    // api.use(
    //     session({
    //         genid: req => {
    //             logger.warn(`Inside session middleware genid-sessionID : ${req.sessionID}`);
    //             return uuid();
    //         },
    //         store: new FileStore(),
    //         secret: "keyboard cat",
    //         resave: false,
    //         saveUninitialized: true
    //     })
    // );

    api.use(passport.initialize());
    api.use(passport.session());

    // api.use((req, res, next) => {
    //     if (req.cookies && req.cookies.user_sid && !req.session.user) {
    //         res.clearCookie("user_sid");
    //     }
    //     next();
    // });

    api.use(function(err, req, res, next) {
      logger.error("inside the error handler function ");
      let erorrObj = this.jr.JageeraErrorHandler.handleError(err);
      res.status(erorrObj.code).send({
        error: erorrObj,
      });
    });

    api.post("/login", (req, res) => {
      this.jr.LoginService.handleLogin(req, res);
    });

    api.post("/logout", (req, res) => {
      this.jr.LoginService.handleLogout(req, res);
    });

    api.post("/signup", (req, res, next) => {
      this.jr.SignupService.handleSignup(req, res, next);
    });

    api.post("/verifyotp", (req, res, next) => {
      this.jr.SignupService.verifyUser(req, res, next);
    });

    api.post("/resendotp", (req, res) => {
      this.jr.SignupService.resendOTP(req, res);
    });

    api.get("/glogin/callback", (req, res) => {
      console.log("inside the glogin callback ", res);
    });
    api.get("/google/redirect", passport.authenticate("google"), (req, res) => {
      res.redirect("http://localhost:4200");
      // this.jr.MailService.setupTransport(res);
    });

    api.get(
      "/google",
      passport.authenticate("google", {
        scope: ["profile"],
      })
    );

    api.get("/_m/:identifier", (req, res) => {
      this.jr.ModuleService.find(req, res);
    });

    api.get("/_a/:identifier", (req, res) => {
      this.jr.ActionManager.getForm(req, res);
    });

    api.post("/_as/:identifier", (req, res) => {
      this.jr.ActionManager.saveForm(req, res);
    });
  }

  createSession(request, param) {
    request.session.user = {
      username: param.username,
      userId: param._id,
    };
  }

  destroySession(req) {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie("user_sid");
    }
  }

  setCookie() {}

  getCookie() {}

  removeCookie() {}

  getSessionId() {}
}

module.exports = SessionManager;
