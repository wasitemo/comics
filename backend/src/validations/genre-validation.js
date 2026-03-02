import Joi from "joi";

export const addGenreValidation = Joi.object({
  genre: Joi.string().required(),
});

export const updateGenreValidation = Joi.object({
  genre: Joi.string().required(),
});
