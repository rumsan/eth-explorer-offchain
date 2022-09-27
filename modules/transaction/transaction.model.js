const { db, DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");

const schema = {
  txHash: {
    type: DataTypes.CITEXT,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  chainId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  chainData: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  label: DataTypes.STRING(255),
  tags: DataTypes.ARRAY(DataTypes.STRING),
  extras: DataTypes.JSON,
  author: DataTypes.CITEXT,
};
module.exports = class TxModel extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: "tblTransactions" });
  }
};
