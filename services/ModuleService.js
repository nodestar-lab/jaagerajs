class ModuleService {
    constructor(config, jr) {
        this.config = config;
        this.jr = jr;
        this.modules = {};
        logger.info("[*ModuleService]");
    }

    async initialize() {
        console.log("module path is : ", this.config.path);
        this.setupModules(this.config.path);
    }

    async setupModules({
        app,
        modulePath
    }) {
        let _m = require(app + modulePath);
        console.log("modules is: ", _m);
        for (let i of _m) {
            this.modules[i.identifier] = i;
        }
    }

    async find(req, res) {
        console.log("request data is .....  ", req.param("identifier"))
        let identifier = req.param("identifier");
        res.send(this.modules[identifier]);
    }
}

module.exports = ModuleService;