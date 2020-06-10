const ComponentHelper = require("../dependencies/module/ComponentHelper");

class ComponentService {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*ComponentService]");
    this.components = {};
  }

  initialize() {
    this.setup(this.config.path);
  }

  setup({ app, component_path }) {
    let comp = require(app + component_path);
    for (let conf of comp) {
      this.components[conf.identifier] = new ComponentHelper(
        this.config,
        conf,
        this.jr
      );
    }
  }

  getInstance(id) {
    if (this.components[id]) {
      return this.components[id];
    }
    return null;
  }

  async get(id) {
    let currentComponent = this.getInstance(id);
    if (!currentComponent) {
      throw new Error("No such module exists in our system");
    }
    let res = await currentComponent.get();
    return res;
  }
}

module.exports = ComponentService;
