const { AbstractController } = require("@rumsan/core/abstract");
const config = require("config");
const ethers = require("ethers");
const axios = require("axios");
const { ContractModel } = require("../models");
const TxnC = require("../transaction/transaction.controller");
const EXPLORER_API_URL = config.get("services.explorerApi");

const Txn = new TxnC();

const { decodeLogs } = require("./logs.controller");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = ContractModel;
  }

  registrations = {
    proxy: (req) => this.proxy(req),
  };

  async processResult(query, result) {
    const { moduleAction } = query;
    if (moduleAction === "logs>getLogs") return decodeLogs(query, result);
    return result;
  }

  async decorateLikeExplorer(func) {
    let result = await func();
    return {
      message: "OK",
      result,
      status: "1",
    };
  }

  async proxy(req) {
    let { query } = req;
    query.moduleAction = query.module + ">" + query.action;

    if (query.moduleAction === "logs>getLogs") {
      //if topic0 is sent convert to hexString
      if (query.topic0 && !ethers.utils.isHexString(query.topic0))
        query.topic0 = ethers.utils.id(query.topic0);
    }

    if (query.moduleAction === "transaction>gettxinfo")
      return this.decorateLikeExplorer(() => Txn.get(req.query.txhash));

    return this.requestFromExplorer(req.query);
  }

  async requestFromExplorer(query) {
    try {
      let params = query;
      //rpc call to explorer api
      let res = await axios.get(`${EXPLORER_API_URL}`, {
        params,
      });

      //process response
      if (res.data.status === "0") return res.data;
      res.data.result = await this.processResult(query, res.data.result);
      return res.data;
    } catch (e) {
      if (!e.response) throw new Error(e.message);

      return {
        resType: "explorer_error",
        statusCode: e.response.status,
        data: e.response.data,
      };
    }
  }
};
