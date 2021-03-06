module.exports = [
  {
    route: "/login",
    handler: "LoginService",
    method: "handleLogin",
    request_type: "post",
    strategy: "local",
    authenticate: true,
  },
  {
    route: "/logout",
    handler: "LoginService",
    method: "handleLogout",
    request_type: "post",
    authenticate: false,
  },
  {
    route: "/signup",
    handler: "SignupService",
    method: "handleSignup",
    request_type: "post",
    authenticate: false,
  },
  {
    route: "/verifyotp",
    handler: "SignupService",
    method: "verifyUser",
    request_type: "post",
    authenticate: false,
  },
  {
    route: "/resendotp",
    handler: "SignupService",
    method: "resendOTP",
    request_type: "post",
    authenticate: false,
  },
  {
    route: "/_m/:identifier",
    handler: "ModuleService",
    method: "find",
    request_type: "get",
    authenticate: true,
  },
  {
    route: "/_a/:identifier",
    handler: "ActionManager",
    method: "getForm",
    request_type: "get",
    authenticate: true,
  },
  {
    route: "/_as/:identifier",
    handler: "ActionManager",
    method: "saveForm",
    request_type: "post",
    authenticate: true,
  },
];
