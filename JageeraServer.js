"use strict";
const dir_service = "/services";
const dir_routes = "/routes/routes";
const fs = require("fs");
const winston = require("winston");
const logLevel = "debug";

class JageeraServer {
  constructor(config) {
    this.config = config;
    console.log("Jageera is booting up...");
  }

  start(r, s_dir, enty) {
    this.setupServices()
      .then(() => this.setupRoutes(r, s_dir))
      .then(() => this.DBManager.setupEntity(enty))
      .then(() => this.TemplateService.initialize())
      .catch((err) => console.log(err));
  }

  setupServices() {
    let files = fs.readdirSync(this.config.path.jr + dir_service);
    this.createLogger();
    this.configureCoreServices(files);
    return Promise.resolve();
  }

  createLogger() {
    let log_format = winston.format.combine(
      winston.format.colorize({
        all: true,
      }),

      winston.format.timestamp({
        format: "DD-MM-YYYY HH:MM:SS",
      }),
      winston.format.printf(
        (info) => `${info.timestamp}  ${info.level} : ${info.message}`
      )
    );
    global.logger = winston.createLogger({
      level: "debug",
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), log_format),
        }),
      ],
    });
  }

  configureCoreServices(files) {
    let core_service_path = this.config.path.jr + dir_service;
    for (let f of files) {
      let _s = require(core_service_path + "/" + f);
      this[f.split(".")[0]] = new _s(this.config, this);
    }
  }

  async setupRoutes(routes, s_path) {
    this.configureServices(routes, s_path);
    await this.setupURL(routes);
  }

  configureServices(routes, s_path) {
    let servicePath = this.config.path.app + "/src" + dir_service;
    // TODO handle properly
    let files = fs.readdirSync(servicePath);
    for (let f of files) {
      let _s = require(servicePath + "/" + f);
      this[f.split(".")[0]] = new _s(this.config, this);
    }
  }

  async setupURL(routes) {
    // write generic code to initialize all servcies
    let coreRoutes = require(this.config.path.jr + dir_routes);
    let allRoutes = routes.concat(coreRoutes);

    await this.PassportManager.initialize();
    this.passport = this.PassportManager.getPassport();
    this.api = this.ExpressAPI.getAPI();
    // give initialize to all the service
    this.SessionManager.manageAPI(this.api, this.passport);
    this.MailService.initialize()
      .then(() => this.ModuleService.initialize())
      .then(() => this.ComponentService.initialize())
      .then(() => this.ActionManager.initialize())
      .then(() =>
        this.SetupRouter.routeSetup(allRoutes, this.api, this.passport)
      )
      .then(() => this.startServer(this.api));
  }

  async initializeServices() {}

  async startServer(app) {
    await this.ManageServer.runServer(app);
  }
}

module.exports = JageeraServer;
