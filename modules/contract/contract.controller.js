const { AbstractController } = require("@rumsan/core/abstract");
const ethers = require("ethers");
const { ContractModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = ContractModel;
  }

  registrations = {
    save: (req) => this.save(req.params.address, req.payload),
    get: (req) => this.get(req.params.address),
    list: (req) => this.list(),
  };

  async save(address, payload) {
    let { name, contractName, abi } = payload;
    name = name || contractName;
    if (!ethers.utils.isAddress(address))
      throw new Error("Invalid contract address");
    let rec = await this.table.findOne({ where: { address } });
    if (!rec) {
      rec = new this.table({ address, abi, name, chainId: 1 });
    } else {
      if (name) rec.name = name;
      rec.abi = abi;
    }
    return rec.save();
  }

  async get(address) {
    return this.table.findOne({ where: { address } });
  }

  async getAbi(address) {
    let rec = await this.table.findOne({ where: { address } });
    if (!rec) return null;
    return rec.abi;
  }

  async list() {
    return this.table.findAll();
  }
};
