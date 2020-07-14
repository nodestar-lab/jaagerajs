module.exports = {
  strategies: [
    require("./strategies/local"),
    require("./strategies/jwt"),
    require("./strategies/google"),
  ],
};
