class ComponentHelper {
  constructor(config, conf, jr) {
    this.config = config;
    this.conf = conf;
    this.jr = jr;
  }

  async initialize() {}

  async get() {
    let items = await this.getData();
    if (typeof this.conf.formatter == "function") {
      let tempItem = items;
      for (let temp of tempItem) {
        temp = await this.conf.formatter(temp, this.jr);
      }
      items = tempItem;
    }
    return this.toStructure(items);
  }

  toStructure(items) {
    return {
      identifier: this.conf.identifier,
      type: this.conf.type,
      display_config: this.conf.display_config,
      items: items,
    };
  }

  async getData() {
    let coll =
      this.conf.db_config && this.conf.db_config.coll
        ? this.conf.db_config.coll
        : "";
    let filter = this.conf.filter || {};
    let records = await this.jr.DBManager.db[coll].find(filter).then((res) => {
      return res;
    });
    return records;
  }
}

module.exports = ComponentHelper;
