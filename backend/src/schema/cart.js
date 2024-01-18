import joi from "joi"
export const cartDB = joi.object({
    _id: joi.string().required(),
    quantity: joi.number().required(),
  });