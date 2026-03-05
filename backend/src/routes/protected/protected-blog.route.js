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

/**
 * @swagger
 * tags:
 *   name: PROTECTED - BLOG
 */

/**
 * @swagger
 * /protected/blog/get-blog?page={page}&limit={limit}:
 *    get:
 *      summary: ""
 *      tags: [PROTECTED - BLOG]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *      responses:
 *        "200":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  page:
 *                    type: integer
 *                  limit:
 *                    type: integer
 *                  total_data:
 *                    type: integer
 *                  total_page:
 *                    type: integer
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        blog_id:
 *                          type: integer
 *                        account_id:
 *                          type: integer
 *                        blog_title:
 *                          type: string
 *                        blog_content:
 *                          type: string
 *                        blog_image_url:
 *                          type: string
 *                        create_at:
 *                          type: string
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "404":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "500":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 */
protectedBlogRouter.get("/get-blog", authentication, presentBlog);

/**
 * @swagger
 * /protected/blog/get-blog/{blog_id}:
 *    get:
 *      summary: ""
 *      tags: [PROTECTED - BLOG]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: blog_id
 *          schema:
 *            type: integer
 *          required: true
 *      responses:
 *        "200":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  data:
 *                    type: object
 *                    properties:
 *                      blog_id:
 *                        type: integer
 *                      account_id:
 *                        type: integer
 *                      blog_title:
 *                        type: string
 *                      blog_content:
 *                        type: string
 *                      blog_image_id:
 *                        type: string
 *                      blog_image_url:
 *                        type: string
 *                      create_at:
 *                        type: string
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "404":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "500":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 */
protectedBlogRouter.get("/get-blog/:blog_id", authentication, presentBlogById);

/**
 * @swagger
 * /protected/blog/add-blog:
 *    post:
 *      description:
 *      tags: [PROTECTED - BLOG]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required: [blog_title, blog_content, image]
 *              properties:
 *                blog_title:
 *                  type: string
 *                blog_content:
 *                  type: string
 *                image:
 *                  type: string
 *                  format: binary
 *      responses:
 *        "200":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "404":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "500":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 */
protectedBlogRouter.post(
  "/add-blog",
  authentication,
  blogImage.single("image"),
  newBlog,
);

/**
 * @swagger
 * /protected/blog/update-blog/{blog_id}:
 *    patch:
 *      description:
 *      tags: [PROTECTED - BLOG]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: params
 *          name: blog_id
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                blog_title:
 *                  type: string
 *                blog_content:
 *                  type: string
 *                image:
 *                  type: string
 *                  format: binary
 *      responses:
 *        "200":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "404":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "500":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 */
protectedBlogRouter.patch(
  "/update-blog/:blog_id",
  authentication,
  blogImage.single("image"),
  changeBlog,
);

/**
 * @swagger
 * /protected/blog/delete-blog/{blog_id}:
 *    delete:
 *      description:
 *      tags: [PROTECTED - BLOG]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: params
 *          name: blog_id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        "200":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "404":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "500":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 */
protectedBlogRouter.delete("/delete-blog/:blog_id", authentication, eraseBlog);
