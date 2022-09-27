const Validator = require("./proxy.validators");
const Controller = require("./proxy.controller");
const { AbstractRouter } = require("@rumsan/core/abstract");

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "api";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    proxy: {
      method: "GET",
      path: "",
      description: "proxy path to explorer api",
    },
  };
};
