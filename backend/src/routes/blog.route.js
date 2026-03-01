import express from "express";
import { authentication } from "../middleware/auth-middleware.js";
import { blogImage } from "../middleware/blog-image-middleware.js";
import {
  presentBlog,
  presentBlogById,
  newBlog,
  changeBlog,
  eraseBlog,
} from "../controllers/blog.controller.js";

export const blogRouter = express.Router();

blogRouter.get("/get-blog", authentication, presentBlog);
blogRouter.get("/get-blog/:blog_id", authentication, presentBlogById);
blogRouter.post(
  "/add-blog",
  authentication,
  blogImage.single("image"),
  newBlog,
);
blogRouter.patch(
  "/update-blog/:blog_id",
  authentication,
  blogImage.single("image"),
  changeBlog,
);
blogRouter.delete("/delete-blog/:blog_id", authentication, eraseBlog);
