const { AbstractController } = require("@rumsan/core/abstract");
const axios = require("axios");
const ethers = require("ethers");
const config = require("config");
const { TxModel, ContractModel } = require("../models");
const EXPLORER_API_URL = config.get("services.explorerApi");
const HTTP_PROVIDER = config.get("services.blockchain.httpProvider");

const getTxFromExplorer = async (txhash) => {
  let { data } = await axios.get(`${EXPLORER_API_URL}`, {
    params: {
      module: "transaction",
      action: "gettxinfo",
      txhash,
    },
  });
  data.result.transactionHash = data.result.hash;
  delete data.result.success;
  if (data.result.next_page_params) data = await getTxDetails(txhash);
  return data.result;
};

const getTxFromChain = async (txhash) => {
  const httpProvider = new ethers.providers.JsonRpcProvider(HTTP_PROVIDER);
  let data = await httpProvider.getTransactionReceipt(txhash);
  return data;
};

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = TxModel;
  }

  registrations = {
    save: (req) => this.save(req.params.txHash, req.payload),
    list: (req) => this.list(req.query),
    get: (req) => this.get(req.params.txHash, req.query.decodeLogs),
  };

  async save(txHash, payload) {
    payload.offChainData = payload.data;
    delete payload.data;
    let rec = await this.table.findOne({ where: { txHash } });
    if (!rec) {
      payload.details = await getTxFromExplorer(txHash);
      payload.txHash = txHash;
      rec = new this.table(payload);
    } else {
      delete payload.details;
      rec = Object.assign(rec, payload);
    }
    return rec.save();
  }

  async list(filter) {
    return this.table.findAll();
  }

  _decodeLog(log, abi) {
    const iface = new ethers.utils.Interface(abi);

    const topics = log.topics.filter((d) => d !== null);
    return iface.parseLog({
      data: log.data,
      topics,
    });
  }

  async get(txHash, decodeLogs) {
    let txn = await this.table.findOne({ where: { txHash }, raw: true });
    txn.logs = [];
    if (txn && decodeLogs === "true") {
      for (let log of txn.details.logs) {
        let contract = await ContractModel.findOne({
          where: { address: log.address },
        });
        if (contract?.abi) {
          let dLog = this._decodeLog(log, contract.abi);
          txn.logs.push(dLog);
        }
      }
    }
    return txn;
  }
};
