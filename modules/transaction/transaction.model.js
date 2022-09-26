const { db, DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");

const schema = {
  txHash: {
    type: DataTypes.CITEXT,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  offChainData: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  details: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  wallet: {
    type: DataTypes.CITEXT,
  },
};
module.exports = class TxModel extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: "tblTransactions" });
  }
};
