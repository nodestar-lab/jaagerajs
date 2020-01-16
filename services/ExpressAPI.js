const express = require("express");
var app = express();

class ExpressAPI {
    constructor(config, jr) {
        this.config = config;
        this.jr = jr;
        logger.info("[*ExpressAPI]");
    }

    getAPI() {
        return app;
    }
}

module.exports = ExpressAPI;