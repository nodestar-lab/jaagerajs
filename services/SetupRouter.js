class SetupRouter {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*SetupRouter] ");
  }

  async routeSetup(routes, api, passport) {
    return new Promise((resolve, reject) => {
      for (let r of routes) {
        api.post(r.route, passport.authenticate('jwt', {
          session: false
        }), async (req, res) => {
          await this.jr[r.handler].handler(req, res);
        });
      }
      return resolve();
    });
  }
}

module.exports = SetupRouter;