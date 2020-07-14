class ModuleHelper {
  constructor(config, mConfig, jr) {
    this.config = config;
    this.mConfig = mConfig;
    this.jr = jr;
  }

  async get() {
    let items = [];
    if (this.mConfig.mType == "lister") {
      items = await this.getData(); // TODO hold that bitch
    }

    if (this.mConfig.mType == "visual") {
      items = await this.fetchForVisual();
    }
    if (this.mConfig.mType == "nav") {
      if (typeof this.mConfig.items == "function") {
        let navs = await this.mConfig.items(this.jr);
        return { items: navs };
      }
      return { items: this.mConfig.items };
    }

    if (this.mConfig.formatter) {
      let tempItem = items;
      for (let item of tempItem) {
        item = await this.mConfig.formatter(item, this.jr);
      }
      items = tempItem;
    }
    return this.toStructure(items);
  }

  toStructure(items) {
    return {
      items: items,
      identifier: this.mConfig.identifier,
      header: this.mConfig.header,
      pageTitle: this.mConfig.pageTitle,
      mType: this.mConfig.mType,
      top_action: this.mConfig.top_action,
      inline_action: this.mConfig.inline_action,
      filter: this.mConfig.filter,
      display: this.mConfig.display,
    };
  }

  async fetchForVisual() {
    let updatedItems = [];
    if (this.mConfig.items) {
      let allModule = this.mConfig.items;
      for (let singleModule of allModule) {
        let result = await this.getEach(singleModule);
        updatedItems.push(result);
      }
      return updatedItems;
    } else {
      return updatedItems;
    }
  }

  async getEach(mChild) {
    let res = [];
    if (mChild.module) {
      let id = mChild.identifier;
      res = this.jr.ModuleService.get(id);
    }
    if (mChild.component) {
      let id = mChild.identifier;
      res = this.jr.ComponentService.get(id);
    }
    return res;
  }

  async getData() {
    let coll =
      this.mConfig.db_config && this.mConfig.db_config.coll
        ? this.mConfig.db_config.coll
        : "";
    let filter = this.mConfig.filter || {};
    let records = await this.jr.DBManager.db[coll].find(filter).then((res) => {
      return res;
    });
    return records;
  }
}

module.exports = ModuleHelper;
