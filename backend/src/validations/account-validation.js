import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).trim().required(),
  status: Joi.string().trim().lowercase().required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).trim().required(),
});

export const updateAccountValidation = Joi.object({
  name: Joi.string().trim(),
  email: Joi.string().email().trim(),
  password: Joi.string().min(8).trim(),
  status: Joi.string().trim().lowercase(),
});
