import joi from "joi";

export const validateProduct = joi.object({
    name: joi.string().required(),
    price: joi.number().required(),
    quantity: joi.number().required(),
    image: joi.string().required(),
    desc: joi.string().required(),
    categoryId: joi.string().required(),
    outStanding: joi.boolean().required(),
    discount: joi.number().required(),
  })