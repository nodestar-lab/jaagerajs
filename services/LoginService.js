class LoginService {
    constructor(config, jr) {
        this.config = config;
        this.jr = jr;
        logger.info("[*LoginService] ");
    }

    initialize() {}

    async handleLogin(req, res) {
        console.log("body is : ", req.body);
        let passport = this.jr.PassportManager.getPassport();
        this.jr.PassportManager.authenticate(req, res);
    }

    async findUser(data) {
        let result = await this.jr.DBManager.db.user.find(data);
        if (result && result.length > 0) {
            return result[0];
        } else {
            return {
                message: "Login details are wrong",
                authenticated: false
            };
        }
    }

    handleLogout(req, res) {
        req.logout();
        res.send({
            logout: true
        });
    }
}

module.exports = LoginService;