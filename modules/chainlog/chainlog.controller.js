const { AbstractController } = require("@rumsan/core/abstract");
const config = require("config");
const ethers = require("ethers");
const axios = require("axios");
const { ContractModel } = require("../models");
const EXPLORER_API_URL = config.get("services.explorerApi");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = ContractModel;
  }

  registrations = {
    list: (req) => this.list(req.query),
  };

  async list(params) {
    params = params || {};
    params.module = "logs";
    params.action = "getLogs";

    if (params.topic0 && !ethers.utils.isHexString(params.topic0))
      params.topic0 = ethers.utils.id(params.topic0);

    if (!params.address) throw new Error("Must send address.");
    let { data } = await axios.get(`${EXPLORER_API_URL}`, {
      params,
    });
    if (data.status === "0") throw new Error(data.message);
    if (!data.result) return null;

    let contract = await ContractModel.findOne({
      where: { address: params.address },
    });
    if (!contract?.abi)
      return data.result.map((d) => {
        d.decodedLog = null;
        return d;
      });

    const iface = new ethers.utils.Interface(contract.abi);
    return data.result.map((d) => {
      const topics = d.topics.filter((d) => d !== null);
      d.decodedLog = iface.parseLog({
        data: d.data,
        topics,
      });

      return d;
    });
  }
};
