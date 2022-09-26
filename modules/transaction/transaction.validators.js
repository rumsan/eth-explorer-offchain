const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  save: {
    params: Joi.object({
      txHash: Joi.string().required(),
    }),
    payload: Joi.object({
      data: Joi.object()
        .required()
        .error(new Error("Must Send transaction hash")),
    }),
  },
  get: {
    query: Joi.object({
      decodeLogs: Joi.string().optional(),
    }),
    params: Joi.object({
      txHash: Joi.string().required(),
    }),
  },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
