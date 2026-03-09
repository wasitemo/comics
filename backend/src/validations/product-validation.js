import Joi from "joi";

export const addProductValidation = Joi.object({
  product_title: Joi.string().required(),
  author: Joi.string().required(),
  release_date: Joi.date().required(),
  price: Joi.number().required(),
  sypnosis: Joi.string().required(),
  genre: Joi.alternatives()
    .try(
      Joi.array().items(Joi.number().integer()),
      Joi.number().integer(),
      Joi.string(),
    )
    .custom((value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "number") return [value];
      return value.split(",").map(Number);
    })
    .required(),
});

export const upateProductValidation = Joi.object({
  product_title: Joi.string(),
  author: Joi.string(),
  release_date: Joi.date(),
  price: Joi.number(),
  sypnosis: Joi.string(),
  genre: Joi.alternatives()
    .try(
      Joi.array().items(Joi.number().integer()),
      Joi.number().integer(),
      Joi.string(),
    )
    .custom((value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "number") return [value];
      return value.split(",").map(Number);
    }),
});
