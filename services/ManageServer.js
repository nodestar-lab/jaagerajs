class ManageServer {
    constructor(config, jr) {
        this.config = config;
        this.jr = jr;
        logger.info("[*ManageServer] ");
    }

    async runServer(app) {
        app.listen(this.config.port || 3000, res => {
            console.log("[ APP RUNNING : %d ] ", this.config.port);
        });
    }
}
module.exports = ManageServer;