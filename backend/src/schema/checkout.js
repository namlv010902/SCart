import Joi from "joi";

const checkoutValidate = Joi.object({
    email: Joi.string().required().email(),
    phoneNumber: Joi.string().required().pattern(/^0+[0-9]{9}/),
    customerName:Joi.string().required(),
    address:Joi.string().required(),
    note:Joi.allow(),
    products: Joi.array().items({
        _id: Joi.string().required(),
        image: Joi.string().required(),
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required(),
    }).required(),
    totalPayment:Joi.number().integer().required()
});
export default checkoutValidate