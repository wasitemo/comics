import express from "express";

import {
  presentBlog,
  presentBlogById,
} from "../../controllers/blog.controller.js";

export const publicBlogRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: PUBLIC - BLOG
 */

/**
 * @swagger
 * /public/blog/get-blog?page={page}&limit={limit}:
 *    get:
 *      summary: ""
 *      tags: [PUBLIC - BLOG]
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
publicBlogRouter.get("/get-blog", presentBlog);

/**
 * @swagger
 * /public/blog/get-blog/{blog_id}:
 *    get:
 *      summary: ""
 *      tags: [PUBLIC - BLOG]
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
publicBlogRouter.get("/get-blog/:blog_id", presentBlogById);
