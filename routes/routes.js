module.exports = [
	// write common handler to handler to send all requested data to it .
	{
		route: "/login",
		handler: "LoginService",
		method: "handleLogin", // get is method inside the handler
		request_type: "post",
		authenticate: false
	},
	{
		route: "/logout",
		handler: "LoginService",
		method: "handleLogout",
		request_type: "post",
		authenticate: false
	},
	{
		route: "/signup",
		handler: "SignupService",
		method: "handleSignup",
		request_type: "post",
		authenticate: false
	},
	{
		route: "/verifyotp",
		handler: "SignupService",
		method: "verifyUser",
		request_type: "post",
		authenticate: false
	},
	{
		route: "/resendotp",
		handler: "SignupService",
		method: "resendOTP",
		request_type: "post",
		authenticate: false
	},
	{
		route: "/_m/:identifier",
		handler: "ModuleService",
		method: "find",
		request_type: "get",
		authenticate: true
	},
	{
		route: "/_a/:identifier",
		handler: "ActionManager",
		method: "getForm",
		request_type: "get",
		authenticate: true
	},
	{
		route: "/_as/:identifier",
		handler: "ActionManager",
		method: "saveForm",
		request_type: "post",
		authenticate: true
	}
];

// api.post("/login", (req, res) => {
// 	this.jr.LoginService.handleLogin(req, res);
// });

// api.post("/logout", (req, res) => {
// 	this.jr.LoginService.handleLogout(req, res);
// });

// api.post("/signup", (req, res, next) => {
// 	this.jr.SignupService.handleSignup(req, res, next);
// });

// api.post("/verifyotp", (req, res, next) => {
// 	this.jr.SignupService.verifyUser(req, res, next);
// });

// api.post("/resendotp", (req, res) => {
// 	this.jr.SignupService.resendOTP(req, res);
// });

// api.get("/glogin/callback", (req, res) => {
// 	console.log("inside the glogin callback ", res);
// });
// api.get("/google/redirect", passport.authenticate("google"), (req, res) => {
// 	res.redirect("http://localhost:4200");
// 	// this.jr.MailService.setupTransport(res);
// });

// api.get(
// 	"/google",
// 	passport.authenticate("google", {
// 		scope: ["profile"]
// 	})
// );

// api.get("/_m/:identifier", (req, res) => {
// 	this.jr.ModuleService.find(req, res);
// });

// api.get("/_a/:identifier", (req, res) => {
// 	this.jr.ActionManager.getForm(req, res);
// });

// api.post("/_as/:identifier", (req, res) => {
// 	this.jr.ActionManager.saveForm(req, res);
// });
