class ActionManager {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    this.actions = {};
    logger.info("[*ActionManager]");
  }

  async initialize() {
    this.setupModules(this.config.path);
  }

  async setupModules({ app, actionPath }) {
    let actionsForms = require(app + actionPath);
    this.actions = Object.assign({}, actionsForms);
  }

  async getForm(req, res) {
    let params = req.params; // req.params, req.body, or req.query
    let id = params.identifier;
    let form =
      this.actions[id] && this.actions[id].form
        ? Object.assign({}, this.actions[id].form)
        : {};
    res.send(form);
  }

  async saveForm(req, res) {
    let opts = req.body;
    let id = opts.identifier;
    let action = this.actions[id];
    let saveFn = action.save ? action.save : {};
    let values;
    if (typeof saveFn == "function") {
      values = await saveFn(
        opts.values,
        this.jr.DBManager.db,
        this.jr,
        this.config
      );
    } else {
      values = opts.values;
    }
    let result = await this.saveData(action, values);
    let logs = await this.getLogs(values, null, action);
    let reload = action.after_save_reload || false;
    await this.saveActivityLog(logs, values, action, null);
    res.send({ message: logs.notification, reload: reload });
  }

  async saveData(act, val) {
    let dbConfig = act.db_config;
    if (act.type == "update") {
    }
    if (act.type == "delete") {
    }
    if (act.type == "create") {
      let res = await this.createRecord(dbConfig, val);
      console.log("user record created ...", res);
      return res;
    }
  }

  async createRecord({ db, coll }, val) {
    // todo handle db which is other than default
    return this.jr.DBManager.db[coll].save(val).then((res) => {
      let result = res;
      return result;
    });
  }

  async deleteRecord() {}

  async updateRecord() {}

  async getLogs(values, user = null, action) {
    if (typeof action.logs == "function") {
      return action.logs(values, user, this.jr);
    }
    return actions.logs;
  }

  async saveActivityLog(logs, values, action, users = null) {
    let obj = {
      log: logs.log,
      user_id: "",
      user_name: "",
      created: new Date(),
      action: action.identfier
    };
    return this.jr.DBManager.db.activity_log.save(obj).then((res) => {
      console.log("activity log saved... ", res);
      return res;
    });
  }
}

module.exports = ActionManager;
