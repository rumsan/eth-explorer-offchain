const Validator = require("./contract.validators");
const Controller = require("./contract.controller");
const { AbstractRouter } = require("@rumsan/core/abstract");

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "contracts";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    list: {
      method: "GET",
      path: "",
      description: "List all contracts",
    },
    get: {
      method: "GET",
      path: "/{address}",
      description: "Get contract details",
    },
    save: {
      method: "PUT",
      path: "/{address}",
      description: "Add new contract abi",
    },
    patch: {
      method: "PATCH",
      path: "/{address}",
      description: "Patch contract info",
    },
  };
};
