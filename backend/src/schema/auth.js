import joi from "joi";
export const registerSchema = joi.object({
    userName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(6),
    phoneNumber: joi.string().required().pattern(/^0[0-9]{9}$/),
    confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
        "any.only": "Password không khớp",
        "string.empty": "Confirm password không được để trống",
        "any.required": "Trường confirm password là bắt buộc",
    }),
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(6),
});