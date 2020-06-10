const ModuleHelper = require("../dependencies/module/ModuleHelper");
const ComponentHelper = require("../dependencies/module/ComponentHelper");

class ModuleService {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    this.modules = {};
    logger.info("[*ModuleService]");
  }

  async initialize() {
    this.setupModules(this.config.path);
  }

  async setupModules({ app, modulePath }) {
    let allModules = require(app + modulePath);
    for (let mConfig of allModules) {
      this.modules[mConfig.identifier] = new ModuleHelper(
        this.config,
        mConfig,
        this.jr
      );
    }
  }

  getInstance(id) {
    if (id) {
      return this.modules[id];
    }
    return null;
  }

  async find(req, res) {
    let params = req.params; // req.params, req.body, or req.query
    let identifier = params.identifier;
    let result = await this.get(identifier);
    res.send(result);
  }

  async get(id) {
    let currentModule = this.getInstance(id);
    if (!currentModule) {
      throw new Error("No such module exists in our system");
    }
    let res = await currentModule.get();
    return res;
  }
}

module.exports = ModuleService;
