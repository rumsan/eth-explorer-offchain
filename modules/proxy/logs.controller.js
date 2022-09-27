const ethers = require("ethers");
const { ContractModel } = require("../models");

const logs = {
  async decodeLogs(query, result) {
    if (query.address) {
      let contract = await ContractModel.findOne({
        where: { address: query.address },
      });
      if (!contract?.abi)
        return result.map((d) => {
          d.decoded = null;
          return d;
        });

      const iface = new ethers.utils.Interface(contract.abi);
      return result.map((d) => {
        const topics = d.topics.filter((d) => d !== null);
        d.decoded = iface.parseLog({
          data: d.data,
          topics,
        });

        return d;
      });
    }
    return result;
  },
};
module.exports = logs;
