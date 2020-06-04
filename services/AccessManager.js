class AccessManager {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*AccessManager]");
  }

  intialize() {}

  setup(modules) {}

  getWhiteModule() {
    return [];
  }

  getBlackModule() {
    return [];
  }

  getGreyModule() {
    return [];
  }

  getAllModule() {
    return [];
  }

  isModuleAllowed(moduleName) {
    return [];
  }
}

module.exports = AccessManager;
