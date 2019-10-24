"use strict";
const dir_service = "../Jageerajs/services";
const fs = require('fs');
const express = require('express')
var app = express();

class JageeraServer {

    constructor(config) {
        this.config = config;
        console.log("jageera server is initialise...");
    }

    readServiceDir() {
        var files = fs.readdirSync(dir_service);
        this.configureServices(files);
    }

    configureServices(files) {
        for(let f of files){
            var _s = require(dir_service+"/"+f);
            this[f.split(".")[0]] = new _s(this.config,this);
        }
    }

    initialiseServices() {
        console.log("initialising the server");
    }

    setupExpressAPI(){

    }

    setupRoutes(routes, s_path){
        this.setupAdditonalServices(routes, s_path);
        this.setupURL(routes);
    }

    setupAdditonalServices(routes, s_path){
        for(let r of routes){
            var _s = require(s_path+r.handler);
            this[r.handler] = new _s(this.config,this);
        }
    }

    setupURL(routes){
        for(let r of routes){
            app.get(r.route, this[r.handler].handler);
        }
    }

    startServer() {
        app.listen(this.config.port || 3000,(res)=>{
            console.log("application is running on port : ", this.config.port);
        } );       
    }

}

module.exports = JageeraServer;