const { AbstractController } = require("@rumsan/core/abstract");
const axios = require("axios");
const ethers = require("ethers");
const config = require("config");
const { TxModel, ContractModel } = require("../models");
const EXPLORER_API_URL = config.get("services.explorerApi");
const HTTP_PROVIDER = config.get("services.blockchain.httpProvider");

const fromExplorer = async (txhash) => {
  let { data } = await axios.get(`${EXPLORER_API_URL}`, {
    params: {
      module: "transaction",
      action: "gettxinfo",
      txhash,
    },
  });
  if (data.status === "0") return null;
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
    patch: (req) => this.patch(req.params.txHash, req.payload),
    list: (req) => this.list(req.query),
    get: (req) => this.get(req.params.txHash),
  };

  _decodeLog(log, abi) {
    const iface = new ethers.utils.Interface(abi);

    const topics = log.topics.filter((d) => d !== null);
    return iface.parseLog({
      data: log.data,
      topics,
    });
  }

  async add(payload) {
    payload.chainId = 1; //TODO: remove when multiple chains are introduced
    if (!payload.chainData)
      payload.chainData = await fromExplorer(payload.txHash);
    return this.table.create(payload);
  }

  async patch(txHash, payload) {
    let rec = await this.table.findOne({ where: { txHash } });
    if (!rec) throw new Error("Transaction is not cached. Please cache first");

    if (payload.extras) {
      let extras = rec.extras || {};
      rec.extras = Object.assign(extras, payload.extras);
      rec.changed("extras", true);
    }
    if (payload.label) rec.label = payload.label;

    rec.tags = rec.tags || [];
    if (payload.tags) {
      rec.tags = [...new Set([...payload.tags, ...rec.tags])];
    }
    if (payload.removeTags) {
      rec.tags = rec.tags.filter((item) => !payload.removeTags.includes(item));
    }

    await rec.save();
    return this.get(txHash);
  }

  async save(txHash, payload) {
    let rec = await this.table.findOne({ where: { txHash } });
    if (!rec) {
      payload.txHash = txHash;
      await this.add(payload);
    } else {
      delete payload.chainData;
      delete payload.chainId;
      rec = Object.assign(rec, payload);
      await rec.save();
    }
    return this.get(txHash);
  }

  async list(filter) {
    return this.table.findAll();
  }

  async get(txHash) {
    let result = null;
    let fromCache = true;
    let rec = await this.table.findOne({ where: { txHash }, raw: true });
    if (!rec) {
      rec = await this.add({ txHash, chainData: result });
      fromCache = false;
    }
    let { chainData, chainId, label, extras, tags, author } = rec;
    chainData.offchain = {
      chainId,
      label,
      extras,
      tags,
      author,
      fromCache,
    };
    chainData.decodedLogs = [];
    for (let log of chainData.logs) {
      let contract = await ContractModel.findOne({
        where: { address: log.address },
      });
      if (contract?.abi) {
        let dLog = this._decodeLog(log, contract.abi);
        chainData.decodedLogs.push(dLog);
      }
    }
    return chainData;
  }
};
