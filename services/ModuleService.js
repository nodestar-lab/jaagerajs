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
    let _m = require(app + modulePath);
    console.log("modules is: ", _m);
    for (let i of _m) {
      this.modules[i.identifier] = i;
    }
  }

  async find(req, res) {
    let params = req.params; // req.params, req.body, or req.query
    let identifier = params.identifier;
    console.log("identifier is ... ", identifier);
    let mod = Object.assign({}, this.modules[identifier]);
    // check for lister or visual
    if (mod.mType == "lister") {
      mod.items = await this.fetchForLister(mod);
    }

    if (mod.mType == "visual") {
      mod.items = this.fetchForVisual();
    }
    res.send(mod);
  }

  async fetchForVisual() {}

  async fetchForLister(mod) {
    let coll = mod.db_config && mod.db_config.coll ? mod.db_config.coll : "";
    let filter = mod.filter || {};
    let records = await this.jr.DBManager.db[coll].find(filter).then((res) => {
      return res;
    });
    console.log("records is .. ", records);
    return records;
  }
}

module.exports = ModuleService;
