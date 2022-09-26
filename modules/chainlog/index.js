const Validator = require("./chainlog.validators");
const Controller = require("./chainlog.controller");
const { AbstractRouter } = require("@rumsan/core/abstract");

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "logs";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    list: {
      method: "GET",
      path: "",
      description: "List all logs",
    },
  };
};
