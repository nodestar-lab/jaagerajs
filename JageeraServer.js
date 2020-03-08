"use strict";
const dir_service = "/services";
const fs = require("fs");
const winston = require("winston");
const logLevel = "debug";

class JageeraServer {
    constructor(config) {
        this.config = config;
        console.log("Jageera is booting up...");
    }

    setupServices() {
        let files = fs.readdirSync(this.config.path.jr + dir_service);
        this.createLogger();
        this.configureServices(files);
        return Promise.resolve();
    }

    createLogger() {
        let log_format = winston.format.combine(
            winston.format.colorize({
                all: true
            }),

            winston.format.timestamp({
                format: "DD-MM-YYYY HH:MM:SS"
            }),
            winston.format.printf(
                info => `${info.timestamp}  ${info.level} : ${info.message}`
            )
        );
        global.logger = winston.createLogger({
            level: "debug",
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        log_format
                    )
                })
            ]
        });
    }

    configureServices(files) {
        let core_service_path = this.config.path.jr + dir_service;
        for (let f of files) {
            var _s = require(core_service_path + "/" + f);
            this[f.split(".")[0]] = new _s(this.config, this);
        }
    }

    async setupRoutes(routes, s_path) {
        this.setupAdditonalServices(routes, s_path);
        await this.setupURL(routes);
    }

    setupAdditonalServices(routes, s_path) {
        for (let r of routes) {
            var _s = require(s_path + r.handler);
            this[r.handler] = new _s(this.config, this);
        }
    }

    async setupURL(routes) {
        // write generic code to initialize all servcies
        this.PassportManager.initialize();

        let passport = this.PassportManager.getPassport();

        this.api = this.ExpressAPI.getAPI();
        this.SessionManager.manageAPI(this.api, passport);
        this.MailService.initialize();
        this.ModuleService.initialize();
        await this.SetupRouter.routeSetup(routes, this.api, passport);
        await this.startServer(this.api);
    }

    async startServer(app) {
        await this.ManageServer.runServer(app);
    }
}

module.exports = JageeraServer;
