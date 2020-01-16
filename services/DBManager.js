class DBManager {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*DBManager]");
  }

  setupEntity(entities) {
    // collections and schema
    // create modal
    // class save,delete, distinct ,update
    this.db = {};
    for (var enty of entities) {
      var e = require("../dependencies/db/modalEntity");
      this.db[enty.collection_name] = new e(enty);
    }
  }
}

module.exports = DBManager;