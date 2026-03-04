import express from "express";
import { authentication } from "../../middleware/auth-middleware.js";
import { blogImage } from "../../middleware/blog-image-middleware.js";
import {
  presentBlog,
  presentBlogById,
  newBlog,
  changeBlog,
  eraseBlog,
} from "../../controllers/blog.controller.js";

export const protectedBlogRouter = express.Router();

protectedBlogRouter.get("/get-blog", authentication, presentBlog);
protectedBlogRouter.get("/get-blog/:blog_id", authentication, presentBlogById);
protectedBlogRouter.post(
  "/add-blog",
  authentication,
  blogImage.single("image"),
  newBlog,
);
protectedBlogRouter.patch(
  "/update-blog/:blog_id",
  authentication,
  blogImage.single("image"),
  changeBlog,
);
protectedBlogRouter.delete("/delete-blog/:blog_id", authentication, eraseBlog);
