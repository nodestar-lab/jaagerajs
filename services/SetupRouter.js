class SetupRouter {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*SetupRouter] ");
  }

  async routeSetup(routes, api, passport) {
    return new Promise((resolve, reject) => {
      for (let r of routes) {
        if (r.authenticate) {
          api[r.request_type](
            r.route,
            passport.authenticate("jwt", {
              session: false
            }),
            async (req, res) => {
              if (r.method) {
                await this.jr[r.handler][r.method](req, res);
              } else {
                await this.jr[r.handler].handler(req, res);
              }
            }
          );
        } else {
          console.log("not authenticated route", r.route);
          api[r.request_type](r.route, async (req, res) => {
            if (r.method) {
              await this.jr[r.handler][r.method](req, res);
            } else {
              await this.jr[r.handler].handler(req, res);
            }
          });
        }
      }
      return resolve();
    });
  }

  getRequiredParams(req) {
    let params = req.params || {};
    let body = req.body || {};
    return { params: params, body: body };
  }
}

module.exports = SetupRouter;
