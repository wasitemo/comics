import Joi from "joi";

export const addBlogValidation = Joi.object({
  blog_title: Joi.string().required(),
  blog_content: Joi.string().required(),
});

export const updateBlogValidation = Joi.object({
  blog_title: Joi.string(),
  blog_content: Joi.string(),
});
