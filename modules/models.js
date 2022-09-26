require("@rumsan/user").initModels();
const UserModel = require("./user/user.model");
const TxModel = require("./transaction/transaction.model");
const ContractModel = require("./contract/contract.model");

let modelFactory = {
  TxModel: new TxModel().init(),
  ContractModel: new ContractModel().init(),
  UserModel: new UserModel().init(),
};

/**********************************************************
 * All the table associations belong here
 **********************************************************/

module.exports = modelFactory;
