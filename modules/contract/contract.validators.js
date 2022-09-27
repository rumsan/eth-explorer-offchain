const Joi = require("joi");
const { AbstractValidator } = require("@rumsan/core/abstract");

const validators = {
  get: {
    params: Joi.object({
      address: Joi.string().required(),
    }),
  },
  save: {
    params: Joi.object({
      address: Joi.string().required(),
    }),
    payload: Joi.object({
      name: Joi.string().optional(),
      contractName: Joi.string().optional(),
      abi: Joi.array().required(),
    }),
  },
  patch: {
    params: Joi.object({
      address: Joi.string().required(),
    }),
    payload: Joi.object({
      name: Joi.string().optional(),
      tags: Joi.array().optional(),
      removeTags: Joi.array().optional(),
    }),
  },
};

module.exports = class extends AbstractValidator {
  validators = validators;
};
