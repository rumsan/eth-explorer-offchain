const Validator = require("./transaction.validators");
const Controller = require("./transaction.controller");
const { AbstractRouter } = require("@rumsan/core/abstract");

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "transactions";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    save: {
      method: "PUT",
      path: "/{txHash}",
      description: "Add new transaction",
    },
    patch: {
      method: "PATCH",
      path: "/{txHash}",
      description: "Patch offchain data",
    },
    list: {
      method: "GET",
      path: "",
      description: "List all transactions",
      //permissions: ["note_read"],
    },
    get: {
      method: "GET",
      path: "/{txHash}",
      description: "Get transactions by hash",
      //permissions: ["note_read"],
    },
  };
};
