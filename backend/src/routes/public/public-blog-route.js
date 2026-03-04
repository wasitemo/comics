import express from "express";

import {
  presentBlog,
  presentBlogById,
} from "../../controllers/blog.controller.js";

export const publicBlogRouter = express.Router();

publicBlogRouter.get("/get-blog", presentBlog);
publicBlogRouter.get("/get-blog/:blog_id", presentBlogById);
