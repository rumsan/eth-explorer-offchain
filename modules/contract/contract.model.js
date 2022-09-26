const { db, DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");

const schema = {
  address: {
    type: DataTypes.CITEXT,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  chainId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: DataTypes.TEXT,
  abi: {
    type: DataTypes.JSON,
    allowNull: false,
  },
};
module.exports = class TxModel extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: "tblContracts" });
  }
};
