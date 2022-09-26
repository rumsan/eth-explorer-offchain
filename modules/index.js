require("./services");
const WSService = require("@rumsan/core/services/webSocket");
const { AppSettings } = require("@rumsan/core");
const {
  UserRouter,
  AuthRouter,
  RoleRouter,
  RSU_EVENTS,
} = require("@rumsan/user");
const Transaction = require("./transaction");
const Contract = require("./contract");

let Routes = {
  Contract: new Contract(),
  Transaction: new Transaction(),
  Auth: new AuthRouter(),
  Role: new RoleRouter(),
  User: new UserRouter(),
  AppSettings: AppSettings.Router(),
};

module.exports = Routes;
